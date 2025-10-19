import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getTimeline } from "../controllers/timelineController.js";

const router = express.Router();

router.get("/", authMiddleware, getTimeline);

export default router;
