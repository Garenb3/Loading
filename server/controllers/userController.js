const User = require("../models/User");

exports.addToWatchlist = async (req, res) => {
  const userId = req.body.userId;
  const mediaId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user.watchlist.includes(mediaId)) {
      user.watchlist.push(mediaId);
      await user.save();
    }
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Error updating watchlist" });
  }
};

exports.addToFavorites = async (req, res) => {
  const userId = req.body.userId;
  const mediaId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user.favorites.includes(mediaId)) {
      user.favorites.push(mediaId);
      await user.save();
    }
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Error updating favorites" });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Error fetching user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Error updating user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting user" });
  }
};