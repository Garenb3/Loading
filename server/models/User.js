const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePicture: {
    type: String,
    default: "",
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  watchlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  ],

  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  ],

  recentlyViewed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);