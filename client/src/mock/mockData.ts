import {
  UploadedFile,
  PipelineJob,
  Collection,
  QueryHistoryItem,
  SavedPrompt,
  GraphStats,
  InsightMetric,
} from "../types";

export const uploadedFiles: UploadedFile[] = [
  {
    id: "1",
    fileName: "Q3_Earnings_Report.pdf",
    fileType: "PDF",
    uploadTimestamp: "2023-10-24T10:30:00Z",
    status: "Completed",
    size: "2.4 MB",
  },
  {
    id: "2",
    fileName: "Customer_Feedback_Q3.csv",
    fileType: "CSV",
    uploadTimestamp: "2023-10-24T11:15:00Z",
    status: "Completed",
    size: "1.1 MB",
  },
  {
    id: "3",
    fileName: "Project_Alpha_Architecture.docx",
    fileType: "DOCX",
    uploadTimestamp: "2023-10-24T14:20:00Z",
    status: "Completed",
    size: "5.6 MB",
  },
  {
    id: "4",
    fileName: "Competitor_Analysis.pdf",
    fileType: "PDF",
    uploadTimestamp: "2023-10-25T09:05:00Z",
    status: "Processing",
    size: "3.2 MB",
  },
  {
    id: "5",
    fileName: "Sales_Data_2023.json",
    fileType: "JSON",
    uploadTimestamp: "2023-10-25T10:00:00Z",
    status: "Uploaded",
    size: "12.4 MB",
  },
  {
    id: "6",
    fileName: "Meeting_Transcript_Oct25.txt",
    fileType: "TXT",
    uploadTimestamp: "2023-10-25T13:45:00Z",
    status: "Failed",
    size: "45 KB",
  },
  {
    id: "7",
    fileName: "Network_Logs_Week42.csv",
    fileType: "CSV",
    uploadTimestamp: "2023-10-26T08:30:00Z",
    status: "Uploaded",
    size: "45.1 MB",
  },
  {
    id: "8",
    fileName: "Employee_Handbook_2023.pdf",
    fileType: "PDF",
    uploadTimestamp: "2023-10-26T09:15:00Z",
    status: "Completed",
    size: "1.8 MB",
  },
  {
    id: "9",
    fileName: "Q4_Projections.xlsx",
    fileType: "XLSX",
    uploadTimestamp: "2023-10-26T11:00:00Z",
    status: "Processing",
    size: "2.1 MB",
  },
  {
    id: "10",
    fileName: "Marketing_Assets.zip",
    fileType: "ZIP",
    uploadTimestamp: "2023-10-26T14:30:00Z",
    status: "Uploaded",
    size: "124 MB",
  },
];

export const pipelineJobs: PipelineJob[] = [
  {
    id: "job-1",
    fileName: "Competitor_Analysis.pdf",
    fileType: "PDF",
    stages: [
      { name: "Upload", status: "done" },
      { name: "Parse", status: "done" },
      { name: "Extract", status: "active" },
      { name: "Categorize", status: "pending" },
      { name: "Graph Merge", status: "pending" },
      { name: "Ready", status: "pending" },
    ],
  },
  {
    id: "job-2",
    fileName: "Q4_Projections.xlsx",
    fileType: "XLSX",
    stages: [
      { name: "Upload", status: "done" },
      { name: "Parse", status: "active" },
      { name: "Extract", status: "pending" },
      { name: "Categorize", status: "pending" },
      { name: "Graph Merge", status: "pending" },
      { name: "Ready", status: "pending" },
    ],
  },
  {
    id: "job-3",
    fileName: "Meeting_Transcript_Oct25.txt",
    fileType: "TXT",
    stages: [
      { name: "Upload", status: "done" },
      { name: "Parse", status: "failed" },
      { name: "Extract", status: "pending" },
      { name: "Categorize", status: "pending" },
      { name: "Graph Merge", status: "pending" },
      { name: "Ready", status: "pending" },
    ],
  },
  {
    id: "job-4",
    fileName: "Q3_Earnings_Report.pdf",
    fileType: "PDF",
    stages: [
      { name: "Upload", status: "done" },
      { name: "Parse", status: "done" },
      { name: "Extract", status: "done" },
      { name: "Categorize", status: "done" },
      { name: "Graph Merge", status: "done" },
      { name: "Ready", status: "done" },
    ],
  },
  {
    id: "job-5",
    fileName: "Customer_Feedback_Q3.csv",
    fileType: "CSV",
    stages: [
      { name: "Upload", status: "done" },
      { name: "Parse", status: "done" },
      { name: "Extract", status: "done" },
      { name: "Categorize", status: "done" },
      { name: "Graph Merge", status: "done" },
      { name: "Ready", status: "done" },
    ],
  },
  {
    id: "job-6",
    fileName: "Project_Alpha_Architecture.docx",
    fileType: "DOCX",
    stages: [
      { name: "Upload", status: "done" },
      { name: "Parse", status: "done" },
      { name: "Extract", status: "done" },
      { name: "Categorize", status: "done" },
      { name: "Graph Merge", status: "done" },
      { name: "Ready", status: "done" },
    ],
  },
];

export const collections: Collection[] = [
  {
    id: "c1",
    title: "Financial Reports 2023",
    itemCount: 45,
    lastUpdated: "2 hours ago",
    previewItems: ["Q1", "Q2", "Q3", "Projections"],
  },
  {
    id: "c2",
    title: "Customer Feedback",
    itemCount: 128,
    lastUpdated: "1 day ago",
    previewItems: ["Surveys", "Support Tickets", "Reviews"],
  },
  {
    id: "c3",
    title: "Engineering Specs",
    itemCount: 32,
    lastUpdated: "3 hours ago",
    previewItems: ["Project Alpha", "API Docs", "DB Schema"],
  },
  {
    id: "c4",
    title: "Competitor Intel",
    itemCount: 14,
    lastUpdated: "5 days ago",
    previewItems: ["Market Share", "Pricing", "Feature Matrix"],
  },
  {
    id: "c5",
    title: "HR & Policies",
    itemCount: 8,
    lastUpdated: "2 weeks ago",
    previewItems: ["Handbook", "Benefits", "Onboarding"],
  },
  {
    id: "c6",
    title: "Network Logs",
    itemCount: 1054,
    lastUpdated: "10 mins ago",
    previewItems: ["Firewall", "Access Logs", "Errors"],
  },
];

export const queryHistory: QueryHistoryItem[] = [
  {
    id: "q1",
    query: "Show me the relationship between Project Alpha and Q3 revenue",
    timestamp: "10 mins ago",
    mode: "Natural Language",
  },
  {
    id: "q2",
    query: "MATCH (c:Company)-[r:ACQUIRED]->(t:Target) RETURN c, r, t LIMIT 10",
    timestamp: "1 hour ago",
    mode: "Cypher",
  },
  {
    id: "q3",
    query: "What are the main complaints in the recent customer feedback?",
    timestamp: "3 hours ago",
    mode: "Natural Language",
  },
  {
    id: "q4",
    query:
      "Find all employees who joined in 2023 and are in the Engineering department",
    timestamp: "1 day ago",
    mode: "Natural Language",
  },
  {
    id: "q5",
    query:
      'MATCH (p:Person)-[:WORKS_ON]->(prj:Project) WHERE prj.status = "Active" RETURN p.name',
    timestamp: "2 days ago",
    mode: "Cypher",
  },
];

export const savedPrompts: SavedPrompt[] = [
  {
    id: "p1",
    label: "Recent Acquisitions",
    query:
      'MATCH (c:Company)-[r:ACQUIRED]->(t:Target) WHERE r.date > "2023-01-01" RETURN c, r, t',
  },
  {
    id: "p2",
    label: "Key Personnel",
    query: "List the key personnel involved in Project Alpha and their roles",
  },
  {
    id: "p3",
    label: "Revenue Drivers",
    query:
      "What were the main revenue drivers mentioned in the Q3 Earnings Report?",
  },
  {
    id: "p4",
    label: "System Errors",
    query:
      "Find the most common error types in the Network Logs from last week",
  },
];

export const graphStats: GraphStats = {
  totalFiles: "1,432",
  activeJobs: "24",
  entityCount: "845,902",
  relationshipCount: "2.4M",
  totalFilesChange: "+12",
  totalFilesChangeType: "up" as const,
  activeJobsChange: "-3",
  activeJobsChangeType: "down" as const,
  entityCountChange: "+8.4k",
  entityCountChangeType: "up" as const,
  relationshipCountChange: "+24k",
  relationshipCountChangeType: "up" as const,
};

export interface DashboardReport {
  id: string;
  title: string;
  subtitle: string;
}

export const dashboardReports: DashboardReport[] = [
  {
    id: "r1",
    title: "Q1 Entity Mapping",
    subtitle: "Generated from Financial Reports dataset",
  },
  {
    id: "r2",
    title: "Q2 Entity Mapping",
    subtitle: "Generated from Customer Feedback dataset",
  },
  {
    id: "r3",
    title: "Q3 Entity Mapping",
    subtitle: "Generated from Engineering Specs dataset",
  },
];

export const insightMetrics: InsightMetric[] = [
  {
    title: "Total Entities Extracted",
    value: "845,902",
    trend: "+12%",
    trendDirection: "up",
  },
  {
    title: "Queries This Week",
    value: "1,240",
    trend: "-5%",
    trendDirection: "down",
  },
  {
    title: "Avg Confidence Score",
    value: "92.4%",
    trend: "+1.2%",
    trendDirection: "up",
  },
];
