const express = require("express");
const router = express.Router();
const { addToWatchlist, addToFavorites, getUser, updateUser, deleteUser } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/:id", getUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.post("/watchlist/:id", addToWatchlist);
router.post("/favorites/:id", addToFavorites);

module.exports = router;