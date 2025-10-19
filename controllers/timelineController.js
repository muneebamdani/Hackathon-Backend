import AiInsight from "../models/AiInsight.js";
import Vital from "../models/Vital.js";
import FileModel from "../models/File.js";

/**
 * GET /api/timeline
 * Merge AI reports (AiInsight joined with File) and vitals by date.
 */
export const getTimeline = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const insights = await AiInsight.find({ userId }).populate("fileId").lean();
    const vitals = await Vital.find({ userId }).lean();

    // Normalize entries by date string (YYYY-MM-DD)
    const dayKey = (d) => {
      const date = new Date(d);
      return date.toISOString().slice(0, 10);
    };

    const map = new Map();

    // Add insights
    for (const ins of insights) {
      const key = dayKey(ins.createdAt || Date.now());
      if (!map.has(key)) map.set(key, { date: key, insights: [], vitals: [] });
      map.get(key).insights.push({
        id: ins._id,
        file: ins.fileId ? { id: ins.fileId._id, url: ins.fileId.fileUrl } : null,
        englishSummary: ins.englishSummary,
        romanUrduSummary: ins.romanUrduSummary,
        doctorQuestions: ins.doctorQuestions,
        foodSuggestions: ins.foodSuggestions,
        homeRemedies: ins.homeRemedies,
        createdAt: ins.createdAt,
      });
    }

    // Add vitals
    for (const v of vitals) {
      const key = dayKey(v.date || Date.now());
      if (!map.has(key)) map.set(key, { date: key, insights: [], vitals: [] });
      map.get(key).vitals.push({
        id: v._id,
        bp: v.bp,
        sugar: v.sugar,
        weight: v.weight,
        notes: v.notes,
        date: v.date,
      });
    }

    // Convert map to sorted array (newest first)
    const timeline = Array.from(map.values()).sort((a, b) => (a.date < b.date ? 1 : -1));

    res.json({ timeline });
  } catch (err) {
    next(err);
  }
};
