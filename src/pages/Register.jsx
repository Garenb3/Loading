import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import { registerUser } from "../utils/authService";
import logo from "../images/logo.png";

// ── Validation helpers ────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}

function validatePassword(password) {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least one number.";
  if (!/[!@#$%^&*]/.test(password)) return "Password must include at least one special character (!@#$%^&*).";
  return null;
}

// ── Inline error component ────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p role="alert" style={errorStyle}>
      <span aria-hidden>⚠</span> {msg}
    </p>
  );
}

// ── Styles ────────────────────────────────────────────────────
const labelStyle = { fontSize: "13px", fontWeight: "600", opacity: 0.9 };

const inputStyle = (hasError) => ({
  padding: "11px 14px",
  borderRadius: "8px",
  border: `1px solid ${hasError ? "#ef4444" : "rgba(255,255,255,0.2)"}`,
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
});

const errorStyle = {
  color: "#ef4444",
  fontSize: "12px",
  margin: "4px 0 0 0",
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

export default function Register() {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const newErrors = {};

    // ── Username ──────────────────────────────────────────────
    if (!username) {
      newErrors.username = "Username is required.";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    // ── Email ─────────────────────────────────────────────────
    if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address (e.g. user@example.com).";
    }

    // ── Password ──────────────────────────────────────────────
    const pwdError = validatePassword(password);
    if (pwdError) newErrors.password = pwdError;

    // ── Confirm password ──────────────────────────────────────
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ── Submit to API ─────────────────────────────────────────
    setIsLoading(true);
    try {
      await registerUser(username, email, password, confirmPassword);
      setErrors({});
      showToast("Registration successful! Redirecting…", "success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      showToast(err.message, "error");
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer toasts={toasts} />

      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 70px)",
          padding: "24px 16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "var(--secondary)",
            borderRadius: "16px",
            overflow: "hidden",
            width: "100%",
            maxWidth: "780px",
          }}
        >
          {/* Left Panel — Branding */}
          <div
            style={{
              flex: "1 1 240px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              gap: "12px",
              minWidth: "200px",
            }}
          >
            <img
              src={logo}
              alt="BingeBoard logo"
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "var(--primary)" }}>
              BingeBoard
            </h1>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0, opacity: 0.65 }}>
              Join our community!<br />Start tracking your shows.
            </p>
            <div style={{ width: "60%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Create Account</h2>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.65 }}>Register to get started</p>
            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Right Panel — Form */}
          <div
            style={{
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 36px",
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  required
                  style={inputStyle(!!errors.username)}
                  onChange={() => clearError("username")}
                />
                <FieldError msg={errors.username} />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  style={inputStyle(!!errors.email)}
                  onChange={() => clearError("email")}
                />
                <FieldError msg={errors.email} />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 12 chars, uppercase, number, special char"
                  required
                  style={inputStyle(!!errors.password)}
                  onChange={() => clearError("password")}
                />
                <FieldError msg={errors.password} />
                <p style={{ fontSize: "11px", opacity: 0.6, margin: "4px 0 0 0" }}>
                  Minimum 12 characters with uppercase, number, and special character (!@#$%^&*)
                </p>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  required
                  style={inputStyle(!!errors.confirmPassword)}
                  onChange={() => clearError("confirmPassword")}
                />
                <FieldError msg={errors.confirmPassword} />
              </div>

              {errors.submit && <FieldError msg={errors.submit} />}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: isLoading ? "var(--primary-dark)" : "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}