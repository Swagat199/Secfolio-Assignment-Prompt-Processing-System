import { Worker } from "bullmq";
import connectDB from "../config/db.js";
import redisConnection from "../config/redis.js";
import env from "../config/env.js";
import PromptJob from "../models/PromptJob.js";
import { waitForRateLimitSlot } from "../services/rateLimiterService.js";
import { callLLMProvider } from "../services/llmService.js";
import { storeCacheEntry } from "../services/semanticCacheService.js";

const startWorker = async () => {
  await connectDB();

  const worker = new Worker(
    "promptQueue",
    async (job) => {
      const { jobId, prompt } = job.data;

      await PromptJob.findByIdAndUpdate(jobId, {
        status: "processing",
        processingStartedAt: new Date(),
        error: null
      });

      try {
        await waitForRateLimitSlot();
        const { providerRequestId, response } = await callLLMProvider(prompt);

        await PromptJob.findByIdAndUpdate(jobId, {
          status: "completed",
          response,
          providerRequestId,
          completedAt: new Date()
        });

        await storeCacheEntry(prompt, response);
        return { providerRequestId };
      } catch (error) {
        await PromptJob.findByIdAndUpdate(jobId, {
          status: "failed",
          error: error.message
        });
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: env.workerConcurrency
    }
  );

  worker.on("ready", () => {
    console.log(`Worker ready with concurrency ${env.workerConcurrency}`);
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed: ${error.message}`);
  });
};

startWorker();
