/**
 * Shared type definitions and data contracts for the Graph-RAG Intelligence System.
 * These types enforce structured communication between all backend modules.
 */

// ─── Ingestion Types ─────────────────────────────────────────────────────────

export type SourceType =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "geospatial"
  | "timeseries";

export interface IngestionRequest {
  sourceId: string;
  sourceType: SourceType;
  filename: string;
  mimeType: string;
  content?: string | Buffer;
  filePath?: string;
  metadata?: Record<string, unknown>;
}

/**
 * StandardizedContentBlock — output of the Multimodal Ingestion Pipeline.
 * All modalities are normalized into text snippets with metadata.
 */
export interface StandardizedContentBlock {
  sourceId: string;
  sourceType: SourceType;
  textContent: string;
  binaryRef?: string;
  metadata: {
    filename: string;
    mimeType: string;
    timestamp: string;
    [key: string]: unknown;
  };
}

// ─── Extraction Types ────────────────────────────────────────────────────────

export interface ExtractedEntity {
  name: string;
  type: string;
  confidence?: number;
  attributes: Record<string, unknown>;
}

export interface ExtractedRelationship {
  source: string;
  target: string;
  type: string;
  strength: number; // 0.0 - 1.0
}

/**
 * ExtractedGraphPayload — output of the LLM Extraction Engine.
 * Structured data ready for graph construction.
 */
export interface ExtractedGraphPayload {
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
  metadata: {
    sourceId: string;
    timestamp: string;
    filename?: string;
    sourceType?: string;
  };
}

// ─── Graph Types ─────────────────────────────────────────────────────────────

export interface GraphInsertionResult {
  success: boolean;
  nodesCreated: number;
  relationshipsCreated: number;
  errors?: string[];
}

// ─── Query Types ─────────────────────────────────────────────────────────────

export interface QueryRequest {
  query: string;
  maxHops?: number;
  includeVisualization?: boolean;
}

export interface GraphPathSegment {
  nodes: string[];
  edges: string[];
}

/**
 * FinalInsightResponse — the contract for all query responses.
 * This schema is enforced for frontend compatibility.
 */
export interface FinalInsightResponse {
  answer: string;
  graph_path: GraphPathSegment[];
  supporting_entities: string[];
  confidence: number; // 0.0 - 1.0
  visualization_hint: "graph" | "chart" | "map" | "timeline";
}

// ─── Confidence Types ────────────────────────────────────────────────────────

export interface ConfidenceScore {
  entityName: string;
  score: number; // 0.0 - 1.0
  basis: "llm_probability" | "cross_reference" | "frequency";
}
