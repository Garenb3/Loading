import Media from "../models/Media.js";

export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().populate("createdBy", "username email");
    res.json(media);
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).json({ error: "Error fetching media" });
  }
};

export const getMediaById = async (req, res) => {
  try {
    const item = await Media.findById(req.params.id).populate("createdBy", "username email");
    if (!item) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).json({ error: "Error fetching media" });
  }
};

export const createMedia = async (req, res) => {
  try {
    const { title, type, genre, description, releaseDate, image, rating, director, cast, studio, duration, trailer, seasons } = req.body;

    // Validate required fields
    if (!title || !type) {
      return res.status(400).json({ error: "Title and type are required" });
    }

    const media = await Media.create({
      title,
      type,
      genre,
      description,
      releaseDate,
      image,
      rating,
      director,
      cast,
      studio,
      duration,
      trailer,
      seasons,
      createdBy: req.userId,
    });

    res.status(201).json(media);
  } catch (err) {
    console.error("Error creating media:", err);
    res.status(500).json({ error: "Error creating media" });
  }
};

export const updateMedia = async (req, res) => {
  try {
    // First, find the media to check ownership
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // ---- AUTHORIZATION CHECK ----
    if (media.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "You are not allowed to update this media" });
    }
    // ----------------------------

    // Perform update
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMedia);
  } catch (err) {
    console.error("Error updating media:", err);
    res.status(500).json({ error: "Error updating media" });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    // Find media to check ownership
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // ---- AUTHORIZATION CHECK ----
    if (media.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "You are not allowed to delete this media" });
    }
    // ----------------------------

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Error deleting media:", err);
    res.status(500).json({ error: "Error deleting media" });
  }
};