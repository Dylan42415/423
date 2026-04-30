export interface GraphNode {
  id: string;
  label: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  textColor: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GraphNodeDetail {
  id: string;
  name: string;
  type: string;
  typeBadgeClass: string;
  properties: Array<{ key: string; value: string }>;
}

export interface GraphLegendItem {
  color: string;
  label: string;
}

export const graphNodes: GraphNode[] = [
  {
    id: "node-center",
    label: "Project Alpha",
    cx: 400,
    cy: 300,
    r: 30,
    color: "hsl(217 91% 60%)",
    textColor: "hsl(var(--foreground))",
  },
  {
    id: "node-acme",
    label: "Acme Corp",
    cx: 250,
    cy: 150,
    r: 20,
    color: "hsl(217 91% 60%)",
    textColor: "hsl(var(--muted-foreground))",
  },
  {
    id: "node-report",
    label: "Q3 Report",
    cx: 550,
    cy: 150,
    r: 20,
    color: "hsl(160 84% 39%)",
    textColor: "hsl(var(--muted-foreground))",
  },
  {
    id: "node-person",
    label: "Jane Doe",
    cx: 200,
    cy: 400,
    r: 20,
    color: "hsl(265 83% 68%)",
    textColor: "hsl(var(--muted-foreground))",
  },
  {
    id: "node-loc",
    label: "New York",
    cx: 600,
    cy: 400,
    r: 20,
    color: "hsl(38 92% 50%)",
    textColor: "hsl(var(--muted-foreground))",
  },
  {
    id: "node-event",
    label: "Merger Event",
    cx: 400,
    cy: 500,
    r: 20,
    color: "hsl(54 91% 54%)",
    textColor: "hsl(var(--muted-foreground))",
  },
];

export const graphEdges: GraphEdge[] = [
  { from: "node-center", to: "node-acme" },
  { from: "node-center", to: "node-report" },
  { from: "node-center", to: "node-person" },
  { from: "node-center", to: "node-loc" },
  { from: "node-center", to: "node-event" },
  { from: "node-acme", to: "node-report" },
  { from: "node-report", to: "node-loc" },
];

export const defaultSelectedNode: GraphNodeDetail = {
  id: "node-center",
  name: "Project Alpha",
  type: "Core Project",
  typeBadgeClass: "bg-primary/10 text-primary border-primary/20",
  properties: [
    { key: "status", value: '"Active"' },
    { key: "budget", value: "1.2M" },
    { key: "start_date", value: '"2023-01-15"' },
  ],
};

export const graphLegend: GraphLegendItem[] = [
  { color: "bg-primary", label: "Core" },
  { color: "bg-blue-500", label: "Company" },
  { color: "bg-green-500", label: "Report" },
  { color: "bg-purple-500", label: "Person" },
  { color: "bg-orange-500", label: "Location" },
];
