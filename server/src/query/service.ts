/**
 * Query Orchestration Service — Manages the end-to-end Graph-RAG reasoning pipeline.
 *
 * Flow: NL Query → Cypher Generation → Graph Execution → Insight Generation → FinalInsightResponse
 */

import { randomUUID } from "node:crypto";
import { logger } from "../lib/logger";
import { config } from "../config";
import { generateJSON } from "../llm";
import {
  CYPHER_SYSTEM_PROMPT,
  INSIGHT_SYSTEM_PROMPT,
  buildCypherPrompt,
  buildInsightPrompt,
} from "../llm/prompts";
import { runCypher, getSchemaHint } from "../graph";
import type { QueryRequest, FinalInsightResponse } from "../types";

/**
 * Execute the full Graph-RAG query pipeline.
 */
export async function query(request: QueryRequest): Promise<FinalInsightResponse> {
  logger.info({ query: request.query, maxHops: request.maxHops }, "Query pipeline started");

  // Step 1: Get the graph schema for context
  let schemaHint: string;
  try {
    schemaHint = await getSchemaHint();
  } catch {
    schemaHint = "Schema unavailable — generate a general Cypher query.";
    logger.warn("Could not retrieve graph schema, using fallback");
  }

  // Step 2: Generate Cypher from natural language
  const cypherPrompt = buildCypherPrompt(request.query, schemaHint);
  const cypherResult = await generateJSON<{ cypher: string }>(cypherPrompt, {
    system: CYPHER_SYSTEM_PROMPT,
    temperature: 0.0,
  });

  const cypher = cypherResult.cypher;
  logger.info({ cypher }, "Generated Cypher query");

  // Step 3: Execute against Neo4j
  let graphResults: any[];
  try {
    graphResults = await runCypher(cypher);
  } catch (err) {
    logger.error({ err, cypher }, "Cypher execution failed");
    return {
      answer: "I was unable to query the knowledge graph. The generated query may be invalid.",
      graph_path: [],
      supporting_entities: [],
      confidence: 0.1,
      visualization_hint: "graph",
    };
  }

  // Truncate graph results to avoid context overflow for reasoning step
  const simplifiedResults = graphResults.map(r => {
    // If it's a node/relationship, just get the essentials
    const node = r.n || r.node || r.e || r.m;
    if (node && node.properties) {
      return { 
        name: node.properties.name, 
        type: node.properties.type,
        attributes: node.properties.attributes // Include attributes for better reasoning
      };
    }
    return r;
  }).slice(0, 40); // Increased to 40 for broader reasoning

  const resultsStr = JSON.stringify(simplifiedResults, null, 2);
  logger.info({ resultCount: graphResults.length, contextLength: resultsStr.length }, "Graph results prepared for analysis");

  // Step 4: Multi-hop reasoning (Pass 2) - if enabled
  if (config.graphRag.enableMultiHop) {
    const hopAnalysisPrompt = `Given the user question: "${request.query}" and these initial graph results: ${resultsStr}
    Do we need to explore more connected entities to provide a complete and deep answer?
    Respond ONLY with a JSON object: { "needsMore": boolean, "cypher": "string (optimized Cypher query to find missing links if needsMore is true)" }`;

    try {
      const hopResult = await generateJSON<{ needsMore: boolean; cypher?: string }>(hopAnalysisPrompt, {
        system: "You are a graph exploration planner.",
        temperature: 0.0,
      });

      if (hopResult.needsMore && hopResult.cypher) {
        logger.info({ newCypher: hopResult.cypher }, "Performing second hop for reasoning");
        const moreResults = await runCypher(hopResult.cypher);
        graphResults = [...graphResults, ...moreResults];
      }
    } catch (err) {
      logger.warn({ err }, "Multi-hop reasoning step failed, continuing with initial results");
    }
  }

  let finalResultsStr = JSON.stringify(graphResults, null, 2);
  if (finalResultsStr.length > 8000) {
    finalResultsStr = finalResultsStr.slice(0, 8000) + "\n...[truncated for context limits]";
  }

  const insightPrompt = buildInsightPrompt(
    request.query,
    finalResultsStr,
  );

  const insight = await generateJSON<FinalInsightResponse>(insightPrompt, {
    system: INSIGHT_SYSTEM_PROMPT,
    temperature: 0.3,
    maxTokens: 1000,
  });

  // Filter out hallucinated paths and entities
  const allResultNodeNames = new Set<string>();
  graphResults.forEach(r => {
    Object.values(r).forEach((val: any) => {
      if (val && typeof val === 'object') {
        if (val.properties?.name) allResultNodeNames.add(val.properties.name);
        if (val.name) allResultNodeNames.add(val.name);
        // Also handle arrays (for r*1..2)
        if (Array.isArray(val)) {
          val.forEach(item => {
            if (item.properties?.name) allResultNodeNames.add(item.properties.name);
            if (item.name) allResultNodeNames.add(item.name);
          });
        }
      }
    });
  });

  const validGraphPath = (Array.isArray(insight.graph_path) ? insight.graph_path : []).filter(path => {
    return path.nodes.every(nodeName => allResultNodeNames.has(nodeName));
  });

  const validSupportingEntities = (Array.isArray(insight.supporting_entities) ? insight.supporting_entities : [])
    .filter(entity => allResultNodeNames.has(entity));

  // Normalize the response
  const response: FinalInsightResponse = {
    answer: String(insight.answer ?? "No answer could be generated."),
    graph_path: validGraphPath,
    supporting_entities: validSupportingEntities,
    confidence: Math.max(0, Math.min(1, Number(insight.confidence) || 0.5)),
    visualization_hint: validateVisualizationHint(insight.visualization_hint),
  };

  logger.info(
    { confidence: response.confidence, entities: response.supporting_entities.length },
    "Query pipeline complete",
  );

  // Persist query history
  try {
    await runCypher(`
      CREATE (q:QueryHistory {
        id: $id,
        text: $query,
        answer: $answer,
        timestamp: datetime(),
        confidence: $confidence
      })
    `, { 
      id: randomUUID(),
      query: request.query, 
      answer: response.answer, 
      confidence: response.confidence 
    });
  } catch (err) {
    logger.warn({ err }, "Failed to persist query history");
  }

  return response;
}

function validateVisualizationHint(
  hint: unknown,
): "graph" | "chart" | "map" | "timeline" {
  const valid = ["graph", "chart", "map", "timeline"];
  return valid.includes(String(hint)) ? (String(hint) as any) : "graph";
}
