import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, useToast } from "../components/Toast";
import { loginUser } from "../utils/authService";
import logo from "../images/logo-new.png";

export default function Login() {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    const newErrors = {};

    // Validation
    if (!email) {
      newErrors.email = "Email is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(email, password);
      setErrors({});
      showToast("Login successful! Redirecting…", "success");
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
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}>
          {/* Left Panel */}
          <div style={{
            flex: "1 1 240px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            gap: "12px",
            minWidth: "200px",
          }}>
            <img src={logo} alt="BingeBoard logo" style={{ width: "175px", height: "175px", objectFit: "contain" }} />
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "var(--primary)" }}>BingeBoard</h1>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0, opacity: 0.65 }}>
              Welcome back!
              <br />
              Log in to continue.
            </p>
            <div style={{ width: "60%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Sign In</h2>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.65 }}>Access your account</p>
            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "var(--primary)", textDecoration: "underline" }}>Register here</Link>
            </p>
          </div>

          {/* Right Panel */}
          <div style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 36px",
          }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Email</label>
              <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  required
                  style={inputStyle(!!errors.email)}
                  onChange={() => clearError("email")}
              />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Password</label>
              <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  style={inputStyle(!!errors.password)}
                  onChange={() => clearError("password")}
              />
                {errors.password && <p style={errorStyle}>{errors.password}</p>}
              </div>

              {errors.submit && <p style={errorStyle}>{errors.submit}</p>}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

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