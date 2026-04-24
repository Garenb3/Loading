import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
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

export default mongoose.model("User", userSchema);