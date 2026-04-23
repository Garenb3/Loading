// ============================================================
//  src/pages/Register.jsx  (FIXED)
//  Changes from original:
//    ✅ Password min length raised to 8 characters
//    ✅ Email validation requires a proper TLD (e.g. .com)
//    ✅ Zero browser alert() calls — all errors show inline
//    ✅ Responsive: box centres correctly on mobile
// ============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import logo from "../images/logo.png";

// ── Validation helpers ────────────────────────────────────────
function isValidEmail(email) {
  // Requires format  local@domain.tld  where tld ≥ 2 chars
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password) && !/[0-9]/.test(password))
    return "Password should include at least one number or uppercase letter.";
  return null;
}

// ── Small inline error component (replaces alert) ────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p
      role="alert"
      style={{
        color: "#ef4444",
        fontSize: "12px",
        margin: "0",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
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

function Register() {
  const [errors, setErrors] = useState({});
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username        = formData.get("username").trim();
    const email           = formData.get("email").trim();
    const password        = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const newErrors = {};

    // ── Username ──────────────────────────────────────────────
    if (!username) {
      newErrors.username = "Username is required.";
    }

    // ── Email (must be valid and include a real TLD like .com) ─
    if (!isValidEmail(email)) {
      newErrors.email =
        "Enter a valid email address (e.g. user@example.com).";
    }

    // ── Password (min 8 chars — raised from original 6) ───────
    const pwdError = validatePassword(password);
    if (pwdError) newErrors.password = pwdError;

    // ── Confirm password ──────────────────────────────────────
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // ← NO alert() — errors appear inline under each field
      return;
    }

    // ── Success path ──────────────────────────────────────────
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    showToast("Registered successfully! Redirecting…", "success");
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <ToastContainer toasts={toasts} />

      {/*
        ── Responsive centering ─────────────────────────────────
        Uses min-height so the card sits in the vertical centre
        even on very short viewports. padding prevents edge-to-edge
        on mobile.
      */}
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
            /* Stack vertically on small screens, side-by-side on larger */
            flexDirection: "row",
            flexWrap: "wrap",          // ← key for mobile responsiveness
            backgroundColor: "var(--secondary)",
            borderRadius: "16px",
            overflow: "hidden",
            width: "100%",
            maxWidth: "780px",
            /* Prevent the card touching the screen edges on mobile */
            boxSizing: "border-box",
          }}
        >
          {/* ── Left branding panel ─────────────────────────── */}
          <div
            style={{
              flex: "1 1 220px",        // shrinks to 220 px before wrapping
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              gap: "12px",
            }}
          >
            <img
              src={logo}
              alt="BingeBoard logo"
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                margin: 0,
                color: "var(--primary)",
              }}
            >
              BingeBoard
            </h1>
            <p
              style={{
                fontSize: "12px",
                textAlign: "center",
                margin: 0,
                opacity: 0.65,
              }}
            >
              Track what you watch.
              <br />
              Save what you love.
            </p>
            <div
              style={{
                width: "60%",
                height: "1px",
                backgroundColor: "rgba(255,255,255,0.1)",
                margin: "4px 0",
              }}
            />
            <h2
              style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}
            >
              Create Account
            </h2>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.65 }}>
              Join us today — it&apos;s free!
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--primary)",
                  textDecoration: "underline",
                }}
              >
                Login here
              </Link>
            </p>
          </div>

          {/* ── Right form panel ────────────────────────────── */}
          <div
            style={{
              flex: "1 1 280px",        // shrinks to 280 px before wrapping
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 36px",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate               /* disable native browser popups */
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* Username */}
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                placeholder="enter your username"
                required
                onChange={() => clearError("username")}
                style={inputStyle(!!errors.username)}
              />
              <FieldError msg={errors.username} />

              {/* Email */}
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                required
                onChange={() => clearError("email")}
                style={inputStyle(!!errors.email)}
              />
              <FieldError msg={errors.email} />

              {/* Password — hint shows the 8-char requirement */}
              <label style={labelStyle}>
                Password
                <span
                  style={{
                    fontSize: "11px",
                    opacity: 0.5,
                    fontWeight: "normal",
                    marginLeft: "6px",
                  }}
                >
                  (min. 8 characters)
                </span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="at least 8 characters"
                minLength="8"
                required
                onChange={() => clearError("password")}
                style={inputStyle(!!errors.password)}
              />
              <FieldError msg={errors.password} />

              {/* Confirm password */}
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="re-enter your password"
                required
                onChange={() => clearError("confirmPassword")}
                style={inputStyle(!!errors.confirmPassword)}
              />
              <FieldError msg={errors.confirmPassword} />

              <button
                type="submit"
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </main>

      {/*
        ── Mobile responsive override ───────────────────────────
        When the viewport is narrow the two panels stack vertically
        and the dividing border becomes a horizontal rule.
      */}
      <style>{`
        @media (max-width: 560px) {
          /* Remove the vertical divider between panels */
          .register-left {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
        }
      `}</style>
    </div>
  );
}

export default Register;