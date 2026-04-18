import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import logo from "../images/logo.png";

export default function Login() {
  const [error, setError] = useState("");
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && email === storedUser.email && password === storedUser.password) {
      setError("");
      showToast("Login successful! Redirecting…", "success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer toasts={toasts} />

      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 70px)",
        padding: "24px 16px",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "var(--secondary)",
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "780px",
          /* Responsive: stack on mobile */
          flexWrap: "wrap",
        }}>
          {/* Left Panel — Branding */}
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
            <img
              src={logo}
              alt="BingeBoard logo"
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "var(--primary)" }}>
              BingeBoard
            </h1>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0, opacity: 0.65 }}>
              Welcome back!<br />Log in to continue.
            </p>
            <div style={{ width: "60%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Sign In</h2>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.65 }}>Access your account</p>
            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Register here
              </Link>
            </p>
          </div>

          {/* Right Panel — Form */}
          <div style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 36px",
          }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                required
                style={inputStyle}
              />

              <label style={{ fontSize: "13px", fontWeight: "600" }}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                style={inputStyle}
              />

              {error && <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>{error}</p>}

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
};
