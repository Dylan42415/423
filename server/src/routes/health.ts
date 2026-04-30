/**
 * Health Check Route — GET /api/healthz
 *
 * Reports the status of all system dependencies.
 */

import { Router, type IRouter } from "express";
import { checkHealth as checkLlm } from "../llm";
import { checkHealth as checkGraph } from "../graph";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  const [llmHealth, graphHealth] = await Promise.all([
    checkLlm().catch((err) => ({
      status: "error" as const,
      model: "unknown",
      error: String(err),
    })),
    checkGraph().catch((err) => ({
      status: "error" as const,
      error: String(err),
    })),
  ]);

  const overallStatus =
    llmHealth.status === "ok" && graphHealth.status === "ok" ? "ok" : "degraded";

  res.status(overallStatus === "ok" ? 200 : 503).json({
    status: overallStatus,
    services: {
      llm: llmHealth,
      graph: graphHealth,
    },
  });
});

export default router;
