const express = require("express");
const router = express.Router();
const { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia } = require("../controllers/mediaController");
const auth = require("../middleware/authMiddleware");

router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.post("/", auth, createMedia);
router.put("/:id", auth, updateMedia);
router.delete("/:id", auth, deleteMedia);

module.exports = router;