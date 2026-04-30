/**
 * Extraction Service — Uses the LLM to extract entities and relationships
 * from StandardizedContentBlocks, producing ExtractedGraphPayloads.
 */

import { logger } from "../lib/logger";
import { generateJSON } from "../llm";
import { EXTRACTION_SYSTEM_PROMPT, buildExtractionPrompt } from "../llm/prompts";
import type {
  StandardizedContentBlock,
  ExtractedGraphPayload,
  ExtractedEntity,
  ExtractedRelationship,
  ConfidenceScore,
} from "../types";
import { config } from "../config";

/**
 * Extract entities and relationships from a content block using the LLM.
 */
export async function extract(
  block: StandardizedContentBlock,
): Promise<ExtractedGraphPayload> {
  logger.info(
    { sourceId: block.sourceId, textLength: block.textContent.length },
    "Starting extraction",
  );

  const prompt = buildExtractionPrompt(block.textContent);

  const raw = await generateJSON<{
    entities: ExtractedEntity[];
    relationships: ExtractedRelationship[];
  }>(prompt, {
    system: EXTRACTION_SYSTEM_PROMPT,
    temperature: 0.1,
  });

  // Validate and normalize
  const entities = (raw.entities ?? []).map(normalizeEntity);
  const relationships = (raw.relationships ?? []).map(normalizeRelationship);

  const payload: ExtractedGraphPayload = {
    entities,
    relationships,
    metadata: {
      sourceId: block.sourceId,
      timestamp: new Date().toISOString(),
      filename: block.metadata.filename,
      sourceType: block.sourceType,
      ...block.metadata,
    },
  };

  logger.info(
    {
      sourceId: block.sourceId,
      entityCount: entities.length,
      relationshipCount: relationships.length,
    },
    "Extraction complete",
  );

  return payload;
}

/**
 * Score the confidence of extracted entities based on simple heuristics.
 */
export function scoreConfidence(
  payload: ExtractedGraphPayload,
): ConfidenceScore[] {
  const entityMentions = new Map<string, number>();

  // Count how many relationships reference each entity
  for (const rel of payload.relationships) {
    entityMentions.set(rel.source, (entityMentions.get(rel.source) ?? 0) + 1);
    entityMentions.set(rel.target, (entityMentions.get(rel.target) ?? 0) + 1);
  }

  return payload.entities.map((entity) => {
    const mentions = entityMentions.get(entity.name) ?? 0;
    
    // Use LLM-provided confidence if available, otherwise fallback to heuristic
    let score = entity.confidence ?? 0.5;
    
    // Boost score slightly if cross-referenced
    if (mentions > 0) {
      score = Math.min(1.0, score + mentions * 0.05);
    }

    return {
      entityName: entity.name,
      score,
      basis: entity.confidence ? ("llm_probability" as const) : ("cross_reference" as const),
    };
  });
}

// ─── Normalization Helpers ───────────────────────────────────────────────────

function normalizeEntity(entity: ExtractedEntity): ExtractedEntity {
  return {
    name: String(entity.name ?? "").trim(),
    type: String(entity.type ?? "Unknown").trim(),
    confidence: Math.max(0, Math.min(1, Number(entity.confidence) || 0.5)),
    attributes: entity.attributes ?? {},
  };
}

function normalizeRelationship(rel: ExtractedRelationship): ExtractedRelationship {
  return {
    source: String(rel.source ?? "").trim(),
    target: String(rel.target ?? "").trim(),
    type: String(rel.type ?? "RELATED_TO")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_"),
    strength: Math.max(0, Math.min(1, Number(rel.strength) || 0.5)),
  };
}
