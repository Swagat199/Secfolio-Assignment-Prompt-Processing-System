import redisConnection from "../config/redis.js";
import env from "../config/env.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForRateLimitSlot = async () => {
  const limit = env.rateLimitPerMinute;

  while (true) {
    const now = Date.now();
    const windowKey = `rate_limit:${Math.floor(now / 60000)}`;
    const currentCount = await redisConnection.incr(windowKey);

    if (currentCount === 1) {
      await redisConnection.pexpire(windowKey, 61000);
    }

    if (currentCount <= limit) {
      return;
    }

    const msUntilNextMinute = 60000 - (now % 60000) + 50;
    await sleep(msUntilNextMinute);
  }
};
