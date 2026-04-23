// ============================================================
//  middleware/verifyToken.js
//  Protects routes — must be logged in (valid JWT)
// ============================================================
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bingeboard_super_secret_key_2024";

/**
 * verifyToken
 * Reads the Bearer token from the Authorization header,
 * verifies it, and attaches the decoded payload to req.user.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, username }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}