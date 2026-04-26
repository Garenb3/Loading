import express from "express";
import { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia } from "../controllers/mediaController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.post("/", authMiddleware, createMedia);
router.put("/:id", authMiddleware, updateMedia);
router.delete("/:id", authMiddleware, deleteMedia);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ filename: req.file.filename });
});

export default router;