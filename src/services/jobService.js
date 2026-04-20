import PromptJob from "../models/PromptJob.js";

export const getMetrics = async () => {
  const [
    total,
    queued,
    processing,
    completed,
    failed,
    cacheHits
  ] = await Promise.all([
    PromptJob.countDocuments(),
    PromptJob.countDocuments({ status: "queued" }),
    PromptJob.countDocuments({ status: "processing" }),
    PromptJob.countDocuments({ status: "completed" }),
    PromptJob.countDocuments({ status: "failed" }),
    PromptJob.countDocuments({ cacheHit: true })
  ]);

  return {
    total,
    queued,
    processing,
    completed,
    failed,
    cacheHits
  };
};
