/**
 * Ingestion Service — Converts raw multi-format inputs into StandardizedContentBlocks.
 * Currently supports text ingestion; multimodal handlers are pluggable stubs.
 */

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import { parseOffice } from "officeparser";

// Promisify the callback-based parseOffice
function parseOfficeAsync(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    parseOffice(filePath, (text: string, err: Error | null) => {
      if (err) reject(err);
      else resolve(text);
    });
  });
}

import { logger } from "../lib/logger";
import type {
  IngestionRequest,
  StandardizedContentBlock,
  SourceType,
} from "../types";

/**
 * Process a raw ingestion request and produce a StandardizedContentBlock.
 */
export async function ingest(
  request: IngestionRequest,
): Promise<StandardizedContentBlock> {
  logger.info(
    { sourceId: request.sourceId, sourceType: request.sourceType, filename: request.filename },
    "Starting ingestion",
  );

  const handler = HANDLERS[request.sourceType];
  if (!handler) {
    throw new Error(`Unsupported source type: ${request.sourceType}`);
  }

  const block = await handler(request);

  logger.info(
    { sourceId: request.sourceId, textLength: block.textContent.length },
    "Ingestion complete",
  );

  return block;
}

// ─── Per-modality Handlers ───────────────────────────────────────────────────

type IngestionHandler = (req: IngestionRequest) => Promise<StandardizedContentBlock>;

import { config } from "../config";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

// Resolve absolute paths for ffmpeg and ffprobe to avoid issues when bundled
const FFMPEG_PATH = path.resolve(
  process.cwd(),
  "node_modules/ffmpeg-static",
  process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
);

const FFPROBE_PATH = path.resolve(
  process.cwd(),
  "node_modules/ffprobe-static/bin",
  process.platform,
  os.arch(),
  process.platform === "win32" ? "ffprobe.exe" : "ffprobe"
);

if (fs.existsSync(FFMPEG_PATH)) {
  logger.info({ FFMPEG_PATH }, "Setting ffmpeg path");
  ffmpeg.setFfmpegPath(FFMPEG_PATH);
} else {
  logger.warn({ FFMPEG_PATH }, "ffmpeg binary not found at resolved path");
}

if (fs.existsSync(FFPROBE_PATH)) {
  logger.info({ FFPROBE_PATH }, "Setting ffprobe path");
  ffmpeg.setFfprobePath(FFPROBE_PATH);
} else {
  logger.warn({ FFPROBE_PATH }, "ffprobe binary not found at resolved path");
}

/**
 * Text handler — content is already text, pass through with metadata.
 */
async function handleText(req: IngestionRequest): Promise<StandardizedContentBlock> {
  let textContent = "";

  if (req.content) {
    textContent = typeof req.content === "string"
      ? req.content
      : req.content.toString("utf-8");
  } else if (req.filePath) {
    const buffer = fs.readFileSync(req.filePath);
    if (req.mimeType === "application/pdf") {
      try {
        const dataBuffer = fs.readFileSync(req.filePath);
        // Handle both CJS and ESM default export variations
        const parsePdf = typeof pdf === "function" ? pdf : pdf.default;
        const data = await parsePdf(dataBuffer);
        textContent = data.text;
      } catch (err) {
        logger.error({ sourceId: req.sourceId, err }, "Failed to parse PDF — falling back to raw string");
        textContent = fs.readFileSync(req.filePath, "utf-8");
      }
    } else if (
      req.mimeType.includes("officedocument") || 
      req.mimeType.includes("msword") || 
      req.mimeType.includes("ms-powerpoint") ||
      req.filename.endsWith(".pptx") ||
      req.filename.endsWith(".docx") ||
      req.filename.endsWith(".xlsx")
    ) {
      // multer saves files without extension — officeparser requires an extension to detect format
      const ext = path.extname(req.filename).toLowerCase() || ".pptx";
      const tempFilePath = req.filePath! + ext;
      try {
        logger.info({ sourceId: req.sourceId, ext }, "Parsing Office document");
        fs.copyFileSync(req.filePath!, tempFilePath);
        const parsedText = await parseOfficeAsync(tempFilePath);
        textContent = typeof parsedText === "string" ? parsedText : String(parsedText || "");
      } catch (err) {
        logger.error({ sourceId: req.sourceId, err }, "Failed to parse Office document — falling back to raw text");
        textContent = "";
      } finally {
        try { fs.unlinkSync(tempFilePath); } catch { /* ignore cleanup errors */ }
      }
    } else {
      textContent = fs.readFileSync(req.filePath, "utf-8");
    }

    // Strip non-printable/binary control characters that break LLM JSON generation
    // Keep: printable ASCII, tabs, newlines, carriage returns; remove: control chars \x00-\x08, \x0B-\x0C, \x0E-\x1F, \x7F+garbage
    textContent = textContent
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // remove control chars
      .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, " ") // replace non-standard chars with space
      .replace(/\s{3,}/g, "\n\n") // collapse excessive whitespace
      .trim();

    // Truncate extremely large texts to avoid LLM token limits
    // Use a much smaller limit (8000 chars) to stay well under token limits
    const MAX_CHARS = 8000;
    if (textContent.length > MAX_CHARS) {
      logger.warn({ sourceId: req.sourceId, originalLength: textContent.length }, "Truncating large text for extraction");
      textContent = textContent.slice(0, MAX_CHARS) + "\n... [truncated for analysis]";
    }
  }

  return {
    sourceId: req.sourceId,
    sourceType: "text",
    textContent,
    metadata: {
      filename: req.filename,
      mimeType: req.mimeType,
      timestamp: new Date().toISOString(),
      ...req.metadata,
    },
  };
}

/**
 * Audio handler — Whisper transcription via GroqCloud.
 */
async function handleAudio(req: IngestionRequest): Promise<StandardizedContentBlock> {
  if (!config.llm.groqApiKey) {
    throw new Error("GROQ_API_KEY is required for audio transcription");
  }
  if (!req.filePath) {
    throw new Error("Audio file must be uploaded to disk (filePath required)");
  }

  logger.info({ sourceId: req.sourceId }, "Sending audio to Groq Whisper");

  const formData = new FormData();
  
  // Use a Blob/File polyfill pattern for node-fetch
  const fileBuffer = fs.readFileSync(req.filePath);
  const blob = new Blob([fileBuffer], { type: req.mimeType });
  formData.append("file", blob, req.filename);
  formData.append("model", config.multimodal.whisperModel);

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.llm.groqApiKey}`,
    },
    body: formData as any,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Whisper error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as { text: string };

  logger.info({ sourceId: req.sourceId, textLength: data.text.length }, "Transcription complete");

  return {
    sourceId: req.sourceId,
    sourceType: "audio",
    textContent: data.text,
    binaryRef: req.filePath,
    metadata: {
      filename: req.filename,
      mimeType: req.mimeType,
      timestamp: new Date().toISOString(),
      ...req.metadata,
    },
  };
}

async function analyzeImageBuffer(buffer: Buffer, mimeType: string, sourceId: string): Promise<string> {
  if (!config.llm.groqApiKey) {
    throw new Error("GROQ_API_KEY is required for vision processing");
  }

  const base64Image = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const body = {
    model: config.multimodal.ocrEngine,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please describe this image in detail. Extract any text (OCR), identify entities (people, places, objects), and explain the relationships between them. Structure the response clearly.",
          },
          {
            type: "image_url",
            image_url: {
              url: dataUrl,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.llm.groqApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Vision error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as any;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq Vision returned empty response");
  }

  return content;
}

/**
 * Image handler — Vision analysis via GroqCloud.
 */
async function handleImage(req: IngestionRequest): Promise<StandardizedContentBlock> {
  if (!req.filePath) {
    throw new Error("Image file must be uploaded to disk (filePath required)");
  }

  logger.info({ sourceId: req.sourceId }, "Sending image to Groq Vision");

  const fileBuffer = fs.readFileSync(req.filePath);
  const content = await analyzeImageBuffer(fileBuffer, req.mimeType, req.sourceId);

  logger.info({ sourceId: req.sourceId, textLength: content.length }, "Image analysis complete");

  return {
    sourceId: req.sourceId,
    sourceType: "image",
    textContent: content,
    binaryRef: req.filePath,
    metadata: {
      filename: req.filename,
      mimeType: req.mimeType,
      timestamp: new Date().toISOString(),
      ...req.metadata,
    },
  };
}

/**
 * Video handler — extracts frames and analyzes them sequentially.
 */
async function handleVideo(req: IngestionRequest): Promise<StandardizedContentBlock> {
  if (!req.filePath) {
    throw new Error("Video file must be uploaded to disk (filePath required)");
  }

  logger.info({ sourceId: req.sourceId }, "Starting video frame extraction");

  const tempDir = path.join(os.tmpdir(), `video-frames-${req.sourceId}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    // Extract frames at 1 fps (configurable via config)
    const fps = config.multimodal.videoFrameRate || 1;
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg(req.filePath!)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .screenshots({
          count: 5, // Limit to 5 frames for now to avoid token/rate limits
          folder: tempDir,
          size: "1280x720",
          filename: "frame-%i.png",
        });
    });

    const frameFiles = fs.readdirSync(tempDir).filter(f => f.endsWith(".png"));
    logger.info({ sourceId: req.sourceId, frameCount: frameFiles.length }, "Frames extracted successfully");

    const frameDescriptions: string[] = [];
    for (const frameFile of frameFiles) {
      const framePath = path.join(tempDir, frameFile);
      const frameBuffer = fs.readFileSync(framePath);
      
      logger.info({ sourceId: req.sourceId, frameFile }, "Analyzing video frame");
      const description = await analyzeImageBuffer(frameBuffer, "image/png", req.sourceId);
      frameDescriptions.push(`[Frame ${frameFile}]: ${description}`);
    }

    const consolidatedContent = `Video Content Analysis Summary:\n\n${frameDescriptions.join("\n\n")}`;

    return {
      sourceId: req.sourceId,
      sourceType: "video",
      textContent: consolidatedContent,
      binaryRef: req.filePath,
      metadata: {
        filename: req.filename,
        mimeType: req.mimeType,
        timestamp: new Date().toISOString(),
        frameCount: frameFiles.length,
        ...req.metadata,
      },
    };
  } finally {
    // Cleanup
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (err) {
      logger.error({ err }, "Failed to cleanup video frames directory");
    }
  }
}

/**
 * Geospatial handler — Extracts coordinates from GeoJSON or simple coordinate strings.
 */
async function handleGeospatial(req: IngestionRequest): Promise<StandardizedContentBlock> {
  let textContent = "";
  let coordinates: { lat: number; lng: number } | null = null;

  if (req.content) {
    textContent = typeof req.content === "string" ? req.content : req.content.toString("utf-8");
  } else if (req.filePath) {
    textContent = fs.readFileSync(req.filePath, "utf-8");
  }

  // Basic heuristic to find coordinates in "lat, lng" or GeoJSON format
  try {
    const data = JSON.parse(textContent);
    if (data.type === "Feature" && data.geometry?.type === "Point") {
      coordinates = { 
        lat: data.geometry.coordinates[1], 
        lng: data.geometry.coordinates[0] 
      };
    } else if (data.lat !== undefined && data.lng !== undefined) {
      coordinates = { lat: Number(data.lat), lng: Number(data.lng) };
    }
  } catch {
    // Fallback to regex if not JSON
    const match = textContent.match(/([-+]?\d{1,2}\.\d+),\s*([-+]?\d{1,3}\.\d+)/);
    if (match) {
      coordinates = { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
  }

  return {
    sourceId: req.sourceId,
    sourceType: "geospatial",
    textContent: textContent || `Geospatial coordinates: ${coordinates?.lat}, ${coordinates?.lng}`,
    metadata: {
      filename: req.filename,
      mimeType: req.mimeType,
      timestamp: new Date().toISOString(),
      coordinates,
      ...req.metadata,
    },
  };
}

/**
 * Time-series handler — Parses sequential data points.
 */
async function handleTimeseries(req: IngestionRequest): Promise<StandardizedContentBlock> {
  let textContent = "";
  let dataPoints: any[] = [];

  if (req.content) {
    textContent = typeof req.content === "string" ? req.content : req.content.toString("utf-8");
  } else if (req.filePath) {
    textContent = fs.readFileSync(req.filePath, "utf-8");
  }

  try {
    const data = JSON.parse(textContent);
    dataPoints = Array.isArray(data) ? data : [data];
  } catch {
    // Handle CSV-like text
    const lines = textContent.split("\n").filter(l => l.trim());
    dataPoints = lines.map(line => {
      const parts = line.split(",");
      return { timestamp: parts[0], value: parts[1] };
    });
  }

  return {
    sourceId: req.sourceId,
    sourceType: "timeseries",
    textContent: textContent || `Time-series with ${dataPoints.length} points`,
    metadata: {
      filename: req.filename,
      mimeType: req.mimeType,
      timestamp: new Date().toISOString(),
      dataPointsCount: dataPoints.length,
      isSequential: true,
      ...req.metadata,
    },
  };
}

const HANDLERS: Record<SourceType, IngestionHandler> = {
  text: handleText,
  audio: handleAudio,
  image: handleImage,
  video: handleVideo,
  geospatial: handleGeospatial,
  timeseries: handleTimeseries,
};
