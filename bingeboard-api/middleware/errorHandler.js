// ============================================================
//  middleware/errorHandler.js
//  Catches any error thrown / passed to next(err) in routes
// ============================================================

/**
 * errorHandler
 * Express error-handling middleware (4 params).
 * Always returns a consistent JSON error shape.
 */
export function errorHandler(err, req, res, _next) {
  console.error("❌ Unhandled error:", err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}