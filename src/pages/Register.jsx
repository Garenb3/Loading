import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, useToast } from "../components/Toast";
import logo from "../images/logo.png";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password) && !/[0-9]/.test(password))
    return "Password should include at least one number or uppercase letter.";
  return null;
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p role="alert" style={{ color: "#ef4444", fontSize: "12px", margin: "0", display: "flex", alignItems: "center", gap: "4px" }}>
      <span aria-hidden>⚠</span> {msg}
    </p>
  );
}

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

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username        = formData.get("username").trim();
    const email           = formData.get("email").trim();
    const password        = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!isValidEmail(email)) newErrors.email = "Enter a valid email address (e.g. user@example.com).";
    const pwdError = validatePassword(password);
    if (pwdError) newErrors.password = pwdError;
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    // TODO: replace with API call to POST /api/auth/register
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    showToast("Registered successfully! Redirecting…", "success");
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} />

      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "80px 16px 24px", // top padding for hamburger
        boxSizing: "border-box",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          backgroundColor: "var(--secondary)",
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "780px",
          boxSizing: "border-box",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}>
          {/* Left branding panel */}
          <div style={{
            flex: "1 1 220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            gap: "12px",
          }}>
            <img src={logo} alt="BingeBoard logo" style={{ width: "100px", height: "100px", objectFit: "contain" }} />
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "var(--primary)" }}>BingeBoard</h1>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0, opacity: 0.65 }}>
              Track what you watch.<br />Save what you love.
            </p>
            <div style={{ width: "60%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Create Account</h2>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.65 }}>Join us today — it&apos;s free!</p>
            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>Login here</Link>
            </p>
          </div>

          {/* Right form panel */}
          <div style={{
            flex: "1 1 280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 36px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}>
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={labelStyle}>Username</label>
              <input type="text" name="username" placeholder="enter your username" required onChange={() => clearError("username")} style={inputStyle(!!errors.username)} />
              <FieldError msg={errors.username} />

              <label style={labelStyle}>Email</label>
              <input type="email" name="email" placeholder="example@email.com" required onChange={() => clearError("email")} style={inputStyle(!!errors.email)} />
              <FieldError msg={errors.email} />

              <label style={labelStyle}>
                Password
                <span style={{ fontSize: "11px", opacity: 0.5, fontWeight: "normal", marginLeft: "6px" }}>(min. 8 characters)</span>
              </label>
              <input type="password" name="password" placeholder="at least 8 characters" minLength="8" required onChange={() => clearError("password")} style={inputStyle(!!errors.password)} />
              <FieldError msg={errors.password} />

              <label style={labelStyle}>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="re-enter your password" required onChange={() => clearError("confirmPassword")} style={inputStyle(!!errors.confirmPassword)} />
              <FieldError msg={errors.confirmPassword} />

              <button
                type="submit"
                style={{
                  marginTop: "12px", padding: "12px",
                  backgroundColor: "var(--primary)", color: "#fff",
                  border: "none", borderRadius: "8px",
                  fontWeight: "bold", fontSize: "15px", cursor: "pointer",
                  width: "100%", boxSizing: "border-box",
                }}
              >Register</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;