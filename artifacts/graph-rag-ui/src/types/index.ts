export interface UploadedFile {
  id: string;
  fileName: string;
  fileType: string;
  uploadTimestamp: string;
  status: 'Uploaded' | 'Processing' | 'Completed' | 'Failed';
  size: string;
}

export interface PipelineStage {
  name: string;
  status: 'done' | 'active' | 'pending' | 'failed';
}

export interface PipelineJob {
  id: string;
  fileName: string;
  fileType: string;
  stages: PipelineStage[];
}

export interface Collection {
  id: string;
  title: string;
  itemCount: number;
  lastUpdated: string;
  previewItems: string[];
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  mode: 'Natural Language' | 'Cypher';
}

export interface SavedPrompt {
  id: string;
  label: string;
  query: string;
}

export interface GraphStats {
  totalFiles: string;
  activeJobs: string;
  entityCount: string;
  relationshipCount: string;
}

export interface InsightMetric {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}
