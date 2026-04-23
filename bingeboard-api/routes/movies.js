// ============================================================
//  routes/movies.js
//  GET    /api/movies          → all movies (public)
//  GET    /api/movies/:id      → single movie (public)
//  POST   /api/movies          → create (protected — logged in)
//  PUT    /api/movies/:id      → update (protected — owner only)
//  DELETE /api/movies/:id      → delete (protected — owner only)
// ============================================================
import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../db/movies.js";

export const router = Router();

// ── GET /api/movies ───────────────────────────────────────────
// Returns all movies. Supports optional query filters:
//   ?type=movie|series
//   ?genre=Action
//   ?search=inception
router.get("/", (req, res) => {
  let results = getAllMovies();

  const { type, genre, search } = req.query;

  if (type) {
    results = results.filter((m) => m.type === type);
  }

  if (genre) {
    results = results.filter((m) =>
      Array.isArray(m.genre)
        ? m.genre.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
        : m.genre?.toLowerCase() === genre.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q) ||
        (Array.isArray(m.genre) ? m.genre.some((g) => g.toLowerCase().includes(q)) : false)
    );
  }

  res.json({ count: results.length, data: results });
});

// ── GET /api/movies/:id ───────────────────────────────────────
router.get("/:id", (req, res) => {
  const movie = getMovieById(req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie / show not found." });
  }
  res.json(movie);
});

// ── POST /api/movies ──────────────────────────────────────────
// Protected: must be logged in
router.post("/", verifyToken, (req, res) => {
  const {
    title, type, genre, description, releaseDate, image,
    rating, director, cast, duration, studio, trailer,
    featured, trending, seasons,
  } = req.body;

  // ── Required field validation ──────────────────────────────
  if (!title || !type || !description || !releaseDate || !image) {
    return res.status(400).json({
      error: "title, type, description, releaseDate, and image are required.",
    });
  }

  if (!["movie", "series"].includes(type)) {
    return res.status(400).json({ error: "type must be 'movie' or 'series'." });
  }

  if (rating !== undefined && (isNaN(rating) || rating < 0 || rating > 10)) {
    return res.status(400).json({ error: "rating must be between 0 and 10." });
  }

  const newMovie = createMovie({
    title,
    type,
    genre: Array.isArray(genre) ? genre : [genre].filter(Boolean),
    description,
    releaseDate,
    image,
    rating: rating !== undefined ? parseFloat(rating) : null,
    director: director || null,
    cast: Array.isArray(cast) ? cast : (cast ? cast.split(",").map((s) => s.trim()) : []),
    duration: duration ? parseInt(duration, 10) : null,
    studio: studio || null,
    trailer: trailer || null,
    featured: !!featured,
    trending: !!trending,
    seasons: seasons || null,
    ownerId: req.user.id,   // ← ties the entry to the logged-in user
  });

  res.status(201).json({ message: "Entry created successfully.", data: newMovie });
});

// ── PUT /api/movies/:id ───────────────────────────────────────
// Protected: must be logged in AND must own the entry
router.put("/:id", verifyToken, (req, res) => {
  const movie = getMovieById(req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Movie / show not found." });
  }

  // ── Owner-only check ───────────────────────────────────────
  // Seeded items have ownerId: null → no one can edit them via API
  // User-created items must match req.user.id
  if (movie.ownerId !== null && movie.ownerId !== req.user.id) {
    return res.status(403).json({
      error: "Forbidden. You can only edit entries you created.",
    });
  }

  const allowedUpdates = [
    "title", "type", "genre", "description", "releaseDate", "image",
    "rating", "director", "cast", "duration", "studio", "trailer",
    "featured", "trending", "seasons",
  ];

  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Validate rating if provided
  if (updates.rating !== undefined && (isNaN(updates.rating) || updates.rating < 0 || updates.rating > 10)) {
    return res.status(400).json({ error: "rating must be between 0 and 10." });
  }

  const updated = updateMovie(req.params.id, updates);
  res.json({ message: "Entry updated successfully.", data: updated });
});

// ── DELETE /api/movies/:id ────────────────────────────────────
// Protected: must be logged in AND must own the entry
router.delete("/:id", verifyToken, (req, res) => {
  const movie = getMovieById(req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Movie / show not found." });
  }

  // ── Owner-only check ───────────────────────────────────────
  if (movie.ownerId !== null && movie.ownerId !== req.user.id) {
    return res.status(403).json({
      error: "Forbidden. You can only delete entries you created.",
    });
  }

  deleteMovie(req.params.id);
  res.json({ message: `"${movie.title}" deleted successfully.` });
});