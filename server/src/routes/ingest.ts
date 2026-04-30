/**
 * Ingestion API Route — POST /api/ingest
 *
 * Accepts raw content, runs the full ingestion → extraction → graph pipeline.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../lib/logger";
import { ingest } from "../ingestion";
import { extract, scoreConfidence } from "../extraction";
import { insertPayload } from "../graph";
import { config } from "../config";
import type { SourceType } from "../types";

import multer from "multer";

const router: IRouter = Router();

const upload = multer({
  dest: config.fs.uploadDir,
  limits: { fileSize: config.fs.maxFileSizeMb * 1024 * 1024 },
});

const VALID_SOURCE_TYPES: SourceType[] = [
  "text",
  "image",
  "audio",
  "video",
  "geospatial",
  "timeseries",
];

/**
 * POST /api/ingest
 * Body (JSON or FormData): { sourceType, filename?, mimeType?, content?, metadata? }
 * File: 'file' field for binary uploads
 */
router.post("/ingest", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { sourceType } = req.body;
    let { filename, mimeType, content, metadata } = req.body;

    // If metadata is sent as a JSON string in form data, parse it
    if (typeof metadata === "string") {
      try {
        metadata = JSON.parse(metadata);
      } catch (e) {
        // ignore
      }
    }

    // Handle file upload
    const filePath = req.file?.path;
    if (req.file) {
      filename = filename || req.file.originalname;
      mimeType = mimeType || req.file.mimetype;
    }

    // Validate required fields
    if (!sourceType || !filename) {
      res.status(400).json({
        error: "Missing required fields: sourceType, filename",
      });
      return;
    }

    if (!content && !filePath) {
      res.status(400).json({
        error: "Must provide either 'content' (text) or 'file' (binary)",
      });
      return;
    }

    if (!VALID_SOURCE_TYPES.includes(sourceType)) {
      res.status(400).json({
        error: `Invalid sourceType. Must be one of: ${VALID_SOURCE_TYPES.join(", ")}`,
      });
      return;
    }

    const sourceId = randomUUID();

    // Step 1: Ingest — normalize raw input
    const block = await ingest({
      sourceId,
      sourceType,
      filename,
      mimeType: mimeType ?? "application/octet-stream",
      content,
      filePath,
      metadata,
    });

    // Step 2: Extract — LLM entity/relationship extraction
    const payload = await extract(block);

    // Step 3: Score — confidence scoring
    const scores = scoreConfidence(payload);

    // Filter payload based on confidence threshold from config
    const threshold = config.graphRag.confidenceThreshold;
    const validEntities = new Set(
      scores.filter((s) => s.score >= threshold).map((s) => s.entityName)
    );

    payload.entities = payload.entities.filter((e) => validEntities.has(e.name));
    payload.relationships = payload.relationships.filter(
      (r) => validEntities.has(r.source) && validEntities.has(r.target)
    );

    // Attach source metadata so Source nodes are correctly linked
    payload.metadata = {
      sourceId,
      timestamp: new Date().toISOString(),
      filename,
      sourceType,
    };

    // Step 4: Insert — write to Neo4j
    const result = await insertPayload(payload);

    res.status(200).json({
      sourceId,
      ingestion: {
        sourceType: block.sourceType,
        textLength: block.textContent.length,
      },
      extraction: {
        entityCount: payload.entities.length,
        relationshipCount: payload.relationships.length,
        entities: payload.entities,
        relationships: payload.relationships,
      },
      confidence: scores,
      graph: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err }, "Ingestion pipeline failed");
    res.status(500).json({ error: message });
  }
});

export default router;
