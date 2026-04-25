import User from "../models/User.js";

// Helper to enforce the authenticated user is modifying their own resource
const requireOwnership = (req, res) => {
  if (req.userId !== req.params.id) {
    res.status(403).json({ error: "You are not allowed to modify this user's data" });
    return false;
  }
  return true;
};

export const addToWatchlist = async (req, res) => {
  try {
    // Ownership check
    if (!requireOwnership(req, res)) return;

    const { mediaId } = req.body;
    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.watchlist.includes(mediaId)) {
      user.watchlist.push(mediaId);
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating watchlist:", err);
    res.status(500).json({ error: "Error updating watchlist" });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    if (!requireOwnership(req, res)) return;

    const { mediaId } = req.body;
    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.favorites.includes(mediaId)) {
      user.favorites.push(mediaId);
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating favorites:", err);
    res.status(500).json({ error: "Error updating favorites" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Ownership check
    if (!requireOwnership(req, res)) return;

    // Prevent password changes through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Ownership check
    if (!requireOwnership(req, res)) return;

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const addToRecentlyViewed = async (req, res) => {
  try {
    const { mediaId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove if already exists, then add to front
    user.recentlyViewed = user.recentlyViewed.filter(
      (id) => id.toString() !== mediaId
    );
    user.recentlyViewed.unshift(mediaId);

    // Cap at 5
    user.recentlyViewed = user.recentlyViewed.slice(0, 5);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error updating recently viewed" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.watchlist = user.watchlist.filter(id => id !== req.params.mediaId);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error updating watchlist" });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.favorites = user.favorites.filter(id => id !== req.params.mediaId);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error updating favorites" });
  }
};