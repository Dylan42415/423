export interface TrendItem {
  label: string;
  percentage: number;
}

export interface AnomalyData {
  title: string;
  description: string;
}

export interface LineDataPoint {
  name: string;
  value: number;
}

export const insightLineData: LineDataPoint[] = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 550 },
  { name: "Thu", value: 450 },
  { name: "Fri", value: 700 },
  { name: "Sat", value: 650 },
  { name: "Sun", value: 800 },
];

export const insightTrendItems: TrendItem[] = [
  { label: "Project Alpha Mentions", percentage: 80 },
  { label: "Q3 Revenue Queries", percentage: 65 },
  { label: "Merger Discussions", percentage: 50 },
];

export const insightAnomalyData: AnomalyData = {
  title: "Unusual Activity Detected",
  description:
    "Spike in cross-border entity relationships observed in the last 2 hours.",
};
