import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadFile, getAllFiles, getFileById } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadFile);
router.get("/", auth, getAllFiles);
router.get("/:id", auth, getFileById);

export default router;
