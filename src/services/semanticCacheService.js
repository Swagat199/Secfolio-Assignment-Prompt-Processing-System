import CacheEntry from "../models/CacheEntry.js";
import env from "../config/env.js";
import { generateEmbedding } from "./embeddingService.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { normalizePrompt } from "../utils/text.js";

export const findSemanticCacheMatch = async (prompt) => {
  const normalizedPrompt = normalizePrompt(prompt);
  const inputEmbedding = await generateEmbedding(normalizedPrompt);

  const exactMatch = await CacheEntry.findOne({ normalizedPrompt }).lean();
  if (exactMatch) {
    return {
      response: exactMatch.response,
      similarity: 1,
      prompt: exactMatch.prompt
    };
  }

  const entries = await CacheEntry.find().lean();
  let bestMatch = null;
  let bestScore = -1;

  for (const entry of entries) {
    const score = cosineSimilarity(inputEmbedding, entry.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore >= env.similarityThreshold) {
    return {
      response: bestMatch.response,
      similarity: Number(bestScore.toFixed(4)),
      prompt: bestMatch.prompt
    };
  }

  return null;
};

export const storeCacheEntry = async (prompt, response) => {
  const normalizedPrompt = normalizePrompt(prompt);
  const embedding = await generateEmbedding(normalizedPrompt);

  await CacheEntry.findOneAndUpdate(
    { normalizedPrompt },
    {
      prompt,
      normalizedPrompt,
      embedding,
      response
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};
