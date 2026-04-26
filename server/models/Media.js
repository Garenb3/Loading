import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    // Numeric ID from Data.js — kept for frontend routing compatibility
    id: {
      type: Number,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["movie", "series"],
      required: true,
    },

    genre: [String],

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    // Duration in minutes (per episode for series)
    duration: {
      type: Number,
    },

    // Stored as a year string e.g. "2010" or full date "2010-07-16"
    releaseDate: {
      type: String,
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
    },

    director: {
      type: String,
      trim: true,
    },

    writer: {
      type: String,
      trim: true,
    },

    producer: {
      type: String,
      trim: true,
    },

    studio: {
      type: String,
      trim: true,
    },

    cast: [String],

    description: {
      type: String,
      trim: true,
    },

    trailer: {
      type: String,
      default: "",
    },

    // Series only
    seasons: {
      total: {
        type: Number,
      },
      episodesPerSeason: [Number],
    },

    // Who added this entry (for AddEditForm user submissions)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Media", mediaSchema);
