import Redis from "ioredis";
import env from "./env.js";

const redisConnection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redisConnection.on("connect", () => console.log("Redis connected"));
redisConnection.on("error", (error) => console.error("Redis error:", error.message));

export default redisConnection;
