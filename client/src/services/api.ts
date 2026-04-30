/**
 * API Service for the Graph-RAG Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export interface IngestResponse {
  sourceId: string;
  ingestion: {
    sourceType: string;
    textLength: number;
  };
  extraction: {
    entityCount: number;
    relationshipCount: number;
    entities: any[];
    relationships: any[];
  };
  confidence: any[];
  graph: {
    success: boolean;
    nodesCreated: number;
    relationshipsCreated: number;
    errors?: string[];
  };
}

export interface QueryResponse {
  answer: string;
  graph_path: Array<{ nodes: string[]; edges: string[] }>;
  supporting_entities: string[];
  confidence: number;
  visualization_hint: "graph" | "chart" | "map" | "timeline";
  error?: string;
}

export const api = {
  /**
   * Upload a file and process it through the ingestion/extraction pipeline.
   */
  async ingestFile(file: File, sourceType: string): Promise<IngestResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sourceType", sourceType);
    formData.append("filename", file.name);
    formData.append("mimeType", file.type);

    const res = await fetch(`${API_BASE_URL}/ingest`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    return res.json() as Promise<IngestResponse>;
  },

  /**
   * Query the Graph-RAG system using natural language.
   */
  async queryGraph(query: string, maxHops: number = 3): Promise<QueryResponse> {
    const res = await fetch(`${API_BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, maxHops }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    return res.json() as Promise<QueryResponse>;
  },

  /**
   * Fetch aggregated graph statistics.
   */
  async getGraphStats(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/graph/stats`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * Fetch all processed sources.
   */
  async getSources(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/graph/sources`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * Fetch full graph data for visualization.
   */
  async getGraphData(): Promise<{ nodes: any[]; links: any[] }> {
    const res = await fetch(`${API_BASE_URL}/graph/data`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * Execute raw Cypher query.
   */
  async queryCypher(cypher: string): Promise<QueryResponse> {
    const res = await fetch(`${API_BASE_URL}/query/cypher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cypher }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return res.json();
  },

  /**
   * Get query history.
   */
  async getQueryHistory(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/query/history`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * Get all collections.
   */
  async getCollections(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/collections`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * Create a new collection.
   */
  async createCollection(data: { title: string; description: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * Get intelligence insights.
   */
  async getInsights(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/insights/metrics`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },
};
