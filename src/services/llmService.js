import env from "../config/env.js";
import { normalizePrompt } from "../utils/text.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const callLLMProvider = async (prompt) => {
  const providerRequestId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (env.useMockProvider) {
    await sleep(1200);
    const normalized = normalizePrompt(prompt);
    return {
      providerRequestId,
      response: `Mock LLM response for: "${prompt}"\n\nSummary: This prompt was processed asynchronously.\nNormalized key: ${normalized}`
    };
  }

  // Replace this section with a real provider call later.
  throw new Error("Real provider mode is not configured yet. Set USE_MOCK_PROVIDER=true.");
};
