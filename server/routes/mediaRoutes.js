import express from "express";
import { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia } from "../controllers/mediaController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.post("/", authMiddleware, createMedia);
router.put("/:id", authMiddleware, updateMedia);
router.delete("/:id", authMiddleware, deleteMedia);

export default router;