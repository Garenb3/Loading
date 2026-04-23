// ============================================================
//  BingeBoard — server.js
//  Run: node server.js  (or: nodemon server.js)
// ============================================================
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as authRouter } from "./routes/auth.js";
import { router as moviesRouter } from "./routes/movies.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());           // JSON body parsing
app.use(morgan("dev"));            // HTTP request logging

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth",   authRouter);
app.use("/api/movies", moviesRouter);

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler (must be last) ──────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅  BingeBoard API running on http://localhost:${PORT}`);
});