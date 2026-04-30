export interface QueryResultEntity {
  label: string;
  colorClass: string;
}

export interface GraphPathStep {
  nodeLabel: string;
  nodeColorClass: string;
  edgeLabel?: string;
}

export interface QueryResult {
  synthesizedAnswer: string;
  supportingEntities: QueryResultEntity[];
  confidenceScore: number;
  sourceCount: number;
  graphPath: GraphPathStep[];
}

export const defaultCypherQuery =
  'MATCH (c:Company)-[r:ACQUIRED]->(t:Target)\nWHERE r.date > "2023-01-01"\nRETURN c.name, r.value, t.name\nORDER BY r.value DESC\nLIMIT 10';

export const mockQueryResult: QueryResult = {
  synthesizedAnswer:
    "Based on the extracted network graph, Project Alpha's architecture heavily relies on the Acme Corp acquisition, specifically their distributed consensus protocol. The Q3 revenue showed a 12% increase directly correlated to the successful integration of these systems in the New York data center under Jane Doe's supervision.",
  supportingEntities: [
    {
      label: "Project Alpha",
      colorClass:
        "bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20",
    },
    {
      label: "Acme Corp",
      colorClass:
        "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20",
    },
    {
      label: "Jane Doe",
      colorClass:
        "bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20",
    },
    {
      label: "New York",
      colorClass:
        "bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20",
    },
  ],
  confidenceScore: 87,
  sourceCount: 14,
  graphPath: [
    {
      nodeLabel: "Jane Doe",
      nodeColorClass: "text-blue-500",
      edgeLabel: "-[SUPERVISES]->",
    },
    {
      nodeLabel: "NY Data Center",
      nodeColorClass: "text-orange-500",
      edgeLabel: "<-[HOSTS]-",
    },
    {
      nodeLabel: "Acme System",
      nodeColorClass: "text-green-500",
      edgeLabel: "-[INTEGRATES_WITH]->",
    },
    {
      nodeLabel: "Project Alpha",
      nodeColorClass: "text-primary",
      edgeLabel: undefined,
    },
  ],
};
