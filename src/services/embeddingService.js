import { normalizePrompt } from "../utils/text.js";

const DIMENSIONS = 32;

export const generateEmbedding = async (text) => {
  const normalized = normalizePrompt(text);
  const vector = Array(DIMENSIONS).fill(0);

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    vector[index % DIMENSIONS] += (code % 97) / 100;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / magnitude).toFixed(6)));
};
