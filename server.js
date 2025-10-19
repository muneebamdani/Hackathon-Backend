// ---------- LOAD ENVIRONMENT VARIABLES FIRST ----------
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env before anything else

// ---------- IMPORT DEPENDENCIES ----------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ---------- IMPORT ROUTES ----------
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import vitalRoutes from "./routes/vitals.js";
import timelineRoutes from "./routes/timeline.js";
import errorHandler from "./middleware/errorHandler.js";

// ---------- INITIALIZE APP ----------
const app = express();

// ---------- ALLOW __dirname IN ES MODULES ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- CORS CONFIGURATION ----------
const allowedOrigins = [
  "https://health-mate-app-by-muneeb.netlify.app", // Vite local dev
  "http://localhost:3000", // CRA local dev
  process.env.FRONTEND_URL, // Your Netlify frontend (e.g. https://healthmate.netlify.app)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server and local requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`⚠️ Blocked by CORS: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ---------- STATIC FILES ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- ROUTES ----------
app.get("/", (req, res) => {
  res.json({
    message: "✅ HealthMate API is running",
    frontend: process.env.FRONTEND_URL || "Not set",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/timeline", timelineRoutes);

// ---------- GLOBAL ERROR HANDLER ----------
app.use(errorHandler);

// ---------- DATABASE CONNECTION ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables");
  process.exit(1);
}

// ---------- CONNECT TO MONGODB AND START SERVER ----------
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // IMPORTANT: Render requires "0.0.0.0" for binding
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
