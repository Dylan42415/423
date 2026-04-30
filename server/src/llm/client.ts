/**
 * LLM Client — Interface to GroqCloud and Ollama for LLM inference.
 * Driven by the centralized configuration system.
 */

import { logger } from "../lib/logger";
import { config } from "../config";

interface GenerateOptions {
  model?: string;
  system?: string;
  temperature?: number;
  jsonMode?: boolean;
  maxTokens?: number;
}

/**
 * Send a prompt to the configured LLM provider and return the raw text response.
 */
export async function generate(
  prompt: string,
  options?: GenerateOptions,
): Promise<string> {
  const provider = config.llm.provider;

  try {
    if (provider === "groq") {
      return await generateGroq(prompt, options);
    } else {
      return await generateOllama(prompt, options);
    }
  } catch (err) {
    logger.error({ provider, err }, "Primary LLM provider failed");

    // Attempt fallback if configured and different from primary
    const fallback = config.llm.fallbackProvider;
    if (fallback && fallback !== provider) {
      logger.info({ fallback }, "Attempting fallback LLM provider");
      if (fallback === "groq") {
        return await generateGroq(prompt, options);
      } else {
        return await generateOllama(prompt, options);
      }
    }

    throw err;
  }
}

/**
 * Send a prompt and parse the response as JSON.
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  options?: GenerateOptions,
): Promise<T> {
  const raw = await generate(prompt, { ...options, jsonMode: true });

  try {
    return JSON.parse(raw) as T;
  } catch {
    logger.error({ raw: raw.slice(0, 500) }, "Failed to parse LLM JSON response");
    throw new Error("LLM returned invalid JSON");
  }
}

// ─── Provider Implementations ────────────────────────────────────────────────

async function generateGroq(prompt: string, options?: GenerateOptions): Promise<string> {
  if (!config.llm.groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const model = options?.model ?? config.llm.model;
  const messages = [];

  if (options?.system) {
    messages.push({ role: "system", content: options.system });
  }
  messages.push({ role: "user", content: prompt });

  const body: any = {
    model,
    messages,
    temperature: options?.temperature ?? 0.1,
    max_tokens: options?.maxTokens ?? config.performance.tokenLimit,
  };

  if (options?.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  logger.info({ provider: "groq", model, promptLength: prompt.length }, "LLM generate request");

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
    throw new Error(`Groq error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as any;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned empty response");
  }

  logger.info({ provider: "groq", responseLength: content.length }, "LLM generate complete");
  return content;
}

async function generateOllama(prompt: string, options?: GenerateOptions): Promise<string> {
  const model = options?.model ?? config.llm.model;

  const body: any = {
    model,
    prompt,
    stream: false,
    options: {
      temperature: options?.temperature ?? 0.1,
      num_predict: options?.maxTokens ?? config.performance.tokenLimit,
    },
  };

  if (options?.system) body.system = options.system;
  if (options?.jsonMode) body.format = "json";

  logger.info({ provider: "ollama", model, promptLength: prompt.length }, "LLM generate request");

  const response = await fetch(`${config.llm.ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as any;
  logger.info({ provider: "ollama", responseLength: data.response?.length }, "LLM generate complete");
  
  return data.response;
}

// ─── Health Checks ───────────────────────────────────────────────────────────

export async function checkHealth(): Promise<{
  status: "ok" | "error";
  provider: string;
  model: string;
  error?: string;
}> {
  const provider = config.llm.provider;
  const model = config.llm.model;

  try {
    if (provider === "groq") {
      if (!config.llm.groqApiKey) throw new Error("GROQ_API_KEY missing");
      // Groq uses standard OpenAI models endpoint
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${config.llm.groqApiKey}` },
      });
      if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    } else {
      const res = await fetch(`${config.llm.ollamaUrl}/api/tags`);
      if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    }

    return { status: "ok", provider, model };
  } catch (err) {
    return {
      status: "error",
      provider,
      model,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
