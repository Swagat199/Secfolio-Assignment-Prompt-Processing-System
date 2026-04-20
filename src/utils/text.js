export const normalizePrompt = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
