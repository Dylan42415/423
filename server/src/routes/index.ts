import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ingestRouter from "./ingest";
import queryRouter from "./query";
import graphRouter from "./graph";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ingestRouter);
router.use(queryRouter);
router.use(graphRouter);

export default router;
