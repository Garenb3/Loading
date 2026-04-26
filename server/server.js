import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// ── Database Connection ────────────────────────────────────────
connectDB();

// ── Security Middleware ────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
); // Set HTTP security headers

// CORS configuration (allow frontend origin)
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Apply rate limiting to API routes
app.use("/api/", limiter);

// ── Body Parser Middleware ────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ── Static Files ──────────────────────────────────────────
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ── Request Logging ───────────────────────────────────────────
app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/user", userRoutes);

// ── Health check endpoint ─────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("❌ Unhandled error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ BingeBoard API running on http://localhost:${PORT}`);
  console.log(`📍 CORS origins: ${allowedOrigins.join(", ")}`);
  console.log(`🔒 Security: Helmet + Rate Limiting enabled`);
});
