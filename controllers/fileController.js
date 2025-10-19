import File from "../models/File.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Upload a new file (with AI summary)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userId = req.user?.id;

    // Step 1️⃣: Extract text (placeholder – implement OCR or PDF parsing later)
    let extractedText = "No text extracted yet from file.";

    // Step 2️⃣: Ask OpenAI to summarize the report
    let aiSummary = "AI summary unavailable.";

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a medical report analyzer. Summarize reports clearly and simply for patients.",
          },
          {
            role: "user",
            content: `Summarize this medical report:\n\n${extractedText}`,
          },
        ],
      });

      aiSummary = aiResponse.choices?.[0]?.message?.content || aiSummary;
    } catch (apiError) {
      if (apiError.status === 429 || apiError.code === "insufficient_quota") {
        console.error("⚠️ OpenAI quota exceeded. Skipping AI summary.");
        aiSummary =
          "OpenAI quota exceeded. Summary unavailable until billing is updated.";
      } else {
        console.error("⚠️ Error calling OpenAI:", apiError);
      }
    }

    // Step 3️⃣: Save file info + AI summary in MongoDB
    const newFile = new File({
      userId,
      filename: req.file.originalname,
      filePath: req.file.path,
      uploadDate: new Date(),
      aiSummary,
    });

    await newFile.save();

    res.status(201).json({ success: true, file: newFile });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

// ✅ Get all user files
export const getAllFiles = async (req, res) => {
  try {
    const userId = req.user?.id;
    const files = await File.find({ userId }).sort({ uploadDate: -1 });
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

// ✅ Get single file by ID
export const getFileById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const file = await File.findOne({ _id: req.params.id, userId });

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.status(200).json({ success: true, file });
  } catch (error) {
    console.error("❌ Error fetching file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch file",
      error: error.message,
    });
  }
};
