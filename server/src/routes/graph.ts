import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { getGraphStats, getSources, getFullGraph, runCypher } from "../graph";
import { logger } from "../lib/logger";

const router = Router();

/**
 * GET /api/graph/stats
 * Returns aggregated statistics for the dashboard.
 */
router.get("/graph/stats", async (req: Request, res: Response) => {
  try {
    const stats = await getGraphStats();
    res.json(stats);
  } catch (err) {
    logger.error({ err }, "Failed to fetch graph stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/graph/sources
 * Returns a list of all processed source files.
 */
router.get("/graph/sources", async (req: Request, res: Response) => {
  try {
    const sources = await getSources();
    res.json(sources);
  } catch (err) {
    logger.error({ err }, "Failed to fetch graph sources");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/graph/data
 * Returns the full graph for visualization.
 */
router.get("/graph/data", async (req: Request, res: Response) => {
  try {
    const data = await getFullGraph();
    res.json(data);
  } catch (err) {
    logger.error({ err }, "Failed to fetch full graph data");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/collections
 */
router.get("/collections", async (req: Request, res: Response) => {
  try {
    const results = await runCypher(`
      MATCH (c:Collection)
      OPTIONAL MATCH (c)-[:CONTAINS]->(item)
      RETURN c.id as id, c.name as title, c.description as description, 
             toString(c.createdAt) as lastUpdated, count(item) as itemCount,
             c.status as status
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

/**
 * POST /api/collections
 */
router.post("/collections", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const id = randomUUID();
    await runCypher(`
      CREATE (c:Collection {
        id: $id,
        name: $title,
        description: $description,
        createdAt: datetime(),
        status: 'Active'
      })
    `, { id, title, description });
    res.status(201).json({ id, title, description, status: 'Active' });
  } catch (err) {
    res.status(500).json({ error: "Failed to create collection" });
  }
});

/**
 * GET /api/insights/metrics
 */
router.get("/insights/metrics", async (req: Request, res: Response) => {
  try {
    const typeDistribution = await runCypher(`
      MATCH (n:Entity)
      RETURN n.type as type, count(n) as count
    `);

    const growthTrend = await runCypher(`
      MATCH (n:Entity)
      WITH date(n.createdAt) as day, count(n) as count
      RETURN toString(day) as day, count
      ORDER BY day ASC
    `);

    const topEntities = await runCypher(`
      MATCH (n:Entity)-[r]->()
      RETURN n.name as name, n.type as type, count(r) as degree
      ORDER BY degree DESC
      LIMIT 10
    `);

    res.json({
      typeDistribution,
      growthTrend,
      topEntities
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch insights");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
