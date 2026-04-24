import express from "express";
import { addToWatchlist, addToFavorites, getUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/watchlist", authMiddleware, addToWatchlist);
router.post("/:id/favorites", authMiddleware, addToFavorites);

export default router;