import express from "express";
import { addToWatchlist, addToFavorites, removeFromWatchlist, removeFromFavorites, getUser, updateUser, deleteUser, addToRecentlyViewed } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/watchlist", authMiddleware, addToWatchlist);
router.post("/:id/favorites", authMiddleware, addToFavorites);
router.post("/:id/recentlyviewed", authMiddleware, addToRecentlyViewed);
router.delete("/:id/watchlist/:mediaId", authMiddleware, removeFromWatchlist);
router.delete("/:id/favorites/:mediaId", authMiddleware, removeFromFavorites);

export default router;