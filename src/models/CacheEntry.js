import mongoose from "mongoose";

const cacheEntrySchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    normalizedPrompt: { type: String, required: true, index: true },
    embedding: { type: [Number], required: true },
    response: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("CacheEntry", cacheEntrySchema);
