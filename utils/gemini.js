/**
 * Minimal wrapper for Gemini (Generative AI)
 * Adjust depending on the exact @google/generative-ai API.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const buildPrompt = (fileUrl) => {
  return `
You are an assistant that processes medical reports.

Input: A medical report accessible at the following URL: ${fileUrl}

TASK: Summarize this medical report in both English and Roman Urdu, highlight abnormal values (if any),
explain findings simply, suggest 3-5 possible questions the user could ask their doctor, list foods to avoid,
and list home remedies. Include the disclaimer: "This is not medical advice."

RETURN FORMAT: Respond only as a single JSON object (no extra text) with fields:
{
  "englishSummary": "<short English summary>",
  "romanUrduSummary": "<short Roman Urdu summary>",
  "abnormalFindings": ["<string>", ...],
  "doctorQuestions": ["<string>", ...],
  "foodSuggestions": ["<string>", ...],
  "homeRemedies": ["<string>", ...],
  "disclaimer": "<string>"
}

Keep text concise and safe. If uncertain, say so in englishSummary.
`;
};

export const generateSummary = async (fileUrl) => {
  const prompt = buildPrompt(fileUrl);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      } else {
        parsed = {
          englishSummary: text.slice(0, 1000),
          romanUrduSummary: "",
          abnormalFindings: [],
          doctorQuestions: [],
          foodSuggestions: [],
          homeRemedies: [],
          disclaimer: "This is not medical advice.",
        };
      }
    }

    return parsed;
  } catch (err) {
    console.error("Gemini generate error:", err);
    throw err;
  }
};
