import User from "../models/User.js";

export const addToWatchlist = async (req, res) => {
  try {
    const { mediaId } = req.body;
    const userId = req.params.id;

    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }

    const user = await User.findById(userId);
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
    const { mediaId } = req.body;
    const userId = req.params.id;

    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }

    const user = await User.findById(userId);
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