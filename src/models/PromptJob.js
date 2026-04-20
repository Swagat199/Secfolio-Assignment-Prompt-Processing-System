import mongoose from "mongoose";

const promptJobSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    normalizedPrompt: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued"
    },
    response: { type: String, default: null },
    error: { type: String, default: null },
    cacheHit: { type: Boolean, default: false },
    similarityScore: { type: Number, default: null },
    providerRequestId: { type: String, default: null },
    processingStartedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("PromptJob", promptJobSchema);
