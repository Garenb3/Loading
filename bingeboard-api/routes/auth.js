// ============================================================
//  routes/auth.js
//  POST /api/auth/register
//  POST /api/auth/login
// ============================================================
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../db/users.js";

export const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "bingeboard_super_secret_key_2024";
const SALT_ROUNDS = 10;

// ── Helper: generate JWT ──────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ── Validation helpers ────────────────────────────────────────
function isValidEmail(email) {
  // must contain @ and end with .com / .net / .org etc.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ── POST /api/auth/register ───────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ── Field presence ────────────────────────────────────────
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, and password are required." });
    }

    // ── Email format (must include .com or valid TLD) ─────────
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address (e.g. user@example.com)." });
    }

    // ── Password length (min 8 characters) ───────────────────
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    // ── Duplicate check ───────────────────────────────────────
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    // ── Hash password with bcrypt ─────────────────────────────
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // ── Create user ───────────────────────────────────────────
    const user = createUser({ username, email, passwordHash });

    // ── Return token immediately (auto-login after register) ──
    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // ── Look up user ──────────────────────────────────────────
    const user = findUserByEmail(email);
    if (!user) {
      // Deliberately vague to prevent user enumeration
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // ── Compare password with bcrypt hash ─────────────────────
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // ── Issue JWT ─────────────────────────────────────────────
    const token = generateToken(user);

    res.json({
      message: "Login successful!",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});