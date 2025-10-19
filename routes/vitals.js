import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addVital, getVitals } from "../controllers/vitalController.js";

const router = express.Router();

router.post("/", authMiddleware, addVital);
router.get("/", authMiddleware, getVitals);

export default router;
