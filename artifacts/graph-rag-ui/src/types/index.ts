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

export interface CollectionFile {
  id: string;
  name: string;
  type: string;
  size: string;
  addedAt: string;
}

export interface CollectionEntity {
  id: string;
  name: string;
  type: string;
  mentions: number;
}

export interface CollectionRelatedQuery {
  id: string;
  query: string;
  mode: 'Natural Language' | 'Cypher';
  runAt: string;
}

export interface CollectionDetailed {
  id: string;
  title: string;
  description: string;
  tags: string[];
  itemCount: number;
  entityCount: number;
  relationshipCount: number;
  lastUpdated: string;
  status: 'Active' | 'Processing' | 'Empty';
  previewItems: string[];
  files: CollectionFile[];
  entities: CollectionEntity[];
  relatedQueries: CollectionRelatedQuery[];
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
