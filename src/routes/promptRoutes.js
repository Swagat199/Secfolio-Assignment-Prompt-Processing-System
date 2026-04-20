import express from "express";
import { getMetrics, getPromptStatus, submitPrompt } from "../controllers/promptController.js";

const router = express.Router();

router.post("/", submitPrompt);
router.get("/metrics", getMetrics);
router.get("/:id", getPromptStatus);

export default router;
