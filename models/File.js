import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },

  // 🧠 AI-generated summary fields
  aiSummary: { type: String, default: "AI summary unavailable." },
  aiSummaryRomanUrdu: { type: String, default: "Roman Urdu summary unavailable." },

  // 🧾 Optional categorization or file type (like 'blood', 'xray', etc.)
  type: { type: String, default: "general" },
});

const File = mongoose.model("File", fileSchema);
export default File;
