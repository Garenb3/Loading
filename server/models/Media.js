const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["movie", "series"],
    required: true,
  },

  genre: [String],

  description: String,

  releaseDate: Date,

  image: String,

  rating: Number,

  director: String,

  cast: [String],

  studio: String,

  duration: Number,

  trailer: String,

  seasons: {
    total: Number,
    episodesPerSeason: [Number],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

module.exports = mongoose.model("Media", mediaSchema);