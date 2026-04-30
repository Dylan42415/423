/**
 * Query API Route — POST /api/query
 *
 * Accepts a natural language question, runs the Graph-RAG reasoning pipeline,
 * and returns a FinalInsightResponse.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { logger } from "../lib/logger";
import { query } from "../query";
import { config } from "../config";

const router: IRouter = Router();

/**
 * POST /api/query
 * Body: { query, maxHops?, includeVisualization? }
 */
router.post("/query", async (req: Request, res: Response) => {
  try {
    const { query: userQuery, maxHops, includeVisualization } = req.body;

    if (!userQuery || typeof userQuery !== "string" || userQuery.trim().length === 0) {
      res.status(400).json({
        error: "Missing required field: query (must be a non-empty string)",
      });
      return;
    }

    const result = await query({
      query: userQuery.trim(),
      maxHops: maxHops ?? config.graphRag.maxDepth,
      includeVisualization: includeVisualization ?? true,
    });

    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : "";
    logger.error({ err, stack }, "Query pipeline failed");
    res.status(500).json({
      answer: "An error occurred while processing your query.",
      graph_path: [],
      supporting_entities: [],
      confidence: 0,
      visualization_hint: "graph",
      error: message,
    });
  }
});

/**
 * POST /api/query/cypher
 * Body: { cypher }
 * Executes raw Cypher against the graph.
 */
router.post("/query/cypher", async (req: Request, res: Response) => {
  try {
    const { cypher: userCypher } = req.body;

    if (!userCypher || typeof userCypher !== "string") {
      res.status(400).json({ error: "Missing required field: cypher" });
      return;
    }

    const { runCypher } = await import("../graph");
    const results = await runCypher(userCypher);

    // Format raw results into a pseudo-insight response for the UI
    res.status(200).json({
      answer: `Executed raw Cypher. Found ${results.length} results.`,
      graph_path: [],
      supporting_entities: [],
      confidence: 1.0,
      visualization_hint: "graph",
      raw_results: results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err }, "Cypher query failed");
    res.status(500).json({ error: message });
  }
});

/**
 * GET /api/query/history
 * Returns the most recent NL queries.
 */
router.get("/query/history", async (_req: Request, res: Response) => {
  try {
    const { runCypher } = await import("../graph");
    const results = await runCypher(`
      MATCH (q:QueryHistory)
      RETURN q.id as id, q.text as query, q.answer as answer, toString(q.timestamp) as timestamp, q.confidence as confidence
      ORDER BY q.timestamp DESC
      LIMIT 10
    `);
    res.status(200).json(results);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
