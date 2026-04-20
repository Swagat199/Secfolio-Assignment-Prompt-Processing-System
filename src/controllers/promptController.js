import PromptJob from "../models/PromptJob.js";
import { promptQueue } from "../queue/promptQueue.js";
import { findSemanticCacheMatch } from "../services/semanticCacheService.js";
import { getMetrics as getMetricsService } from "../services/jobService.js";
import { normalizePrompt } from "../utils/text.js";

export const submitPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required and must be a non-empty string" });
    }

    const normalizedPrompt = normalizePrompt(prompt);
    const cacheResult = await findSemanticCacheMatch(prompt);

    if (cacheResult) {
      const job = await PromptJob.create({
        prompt,
        normalizedPrompt,
        status: "completed",
        response: cacheResult.response,
        cacheHit: true,
        similarityScore: cacheResult.similarity,
        completedAt: new Date()
      });

      return res.status(200).json({
        message: "Served from semantic cache",
        jobId: job._id,
        status: job.status,
        cacheHit: true,
        similarity: cacheResult.similarity,
        response: job.response
      });
    }

    const job = await PromptJob.create({
      prompt,
      normalizedPrompt,
      status: "queued"
    });

    await promptQueue.add("processPrompt", {
      jobId: job._id.toString(),
      prompt
    });

    return res.status(202).json({
      message: "Prompt queued successfully",
      jobId: job._id,
      status: "queued",
      cacheHit: false
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPromptStatus = async (req, res) => {
  try {
    const job = await PromptJob.findById(req.params.id).lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMetrics = async (_req, res) => {
  try {
    const metrics = await getMetricsService();
    return res.status(200).json(metrics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
