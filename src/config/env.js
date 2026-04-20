import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/prompt_processing_system",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD || 0.95),
  rateLimitPerMinute: Number(process.env.RATE_LIMIT_PER_MINUTE || 300),
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY || 5),
  useMockProvider: String(process.env.USE_MOCK_PROVIDER || "true").toLowerCase() === "true"
};

export default env;
