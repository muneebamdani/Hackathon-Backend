import mongoose from "mongoose";

const AiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    englishSummary: String,
    romanUrduSummary: String,
    doctorQuestions: [String],
    foodSuggestions: [String],
    homeRemedies: [String],
  },
  { timestamps: true }
);

const AiInsight = mongoose.model("AiInsight", AiInsightSchema);

export default AiInsight;
