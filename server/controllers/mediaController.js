const Media = require("../models/Media");

exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
    populate("createdBy", "username email")
  } catch {
    res.status(500).json({ msg: "Error fetching media" });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    res.json(item);
  } catch {
    res.status(500).json({ msg: "Error fetching item" });
  }
};

exports.createMedia = async (req, res) => {
  try {
    const media = await Media.create(req.body);
    res.json(media);
  } catch {
    res.status(500).json({ msg: "Error creating media" });
  }
};
exports.updateMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) return res.status(404).json({ msg: "Media not found" });
    res.json(media);
  } catch {
    res.status(500).json({ msg: "Error updating media" });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ msg: "Media deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting media" });
  }
};