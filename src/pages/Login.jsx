import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../images/logo.png";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && email === storedUser.email && password === storedUser.password) {
      setError("");
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Navbar />

      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 60px)",
        padding: "16px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "var(--secondary)",
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "780px",
          height: "min(520px, 90%)"
        }}>

          {/* Left Panel — Branding */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            gap: "12px"
          }}>
            <img
              src={logo}
              alt="MovieTracker logo"
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "20px" }}
            />

            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>
              MovieTracker
            </h1>

            <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
              Welcome back! <br /> Log in to continue.
            </p>

            {/* Divider */}
            <div style={{
              width: "60%",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
              margin: "4px 0"
            }} />

            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              Sign In
            </h2>

            <p style={{ fontSize: "12px", margin: 0 }}>
              Access your account
            </p>

            {/* 👇 Link to Register */}
            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
              Don’t have an account?{" "}
              <Link to="/register" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Register here
              </Link>
            </p>
          </div>

          {/* Right Panel — Form */}
          <div style={{
            flex: 1.3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "32px 36px"
          }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              <label style={{ fontSize: "13px", fontWeight: "600" }}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                required
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.09)",
                  color: "var(--text)",
                  fontSize: "14px"
                }}
              />

              <label style={{ fontSize: "13px", fontWeight: "600" }}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="enter your password"
                required
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.09)",
                  color: "var(--text)",
                  fontSize: "14px"
                }}
              />

              {error && <p style={{ color: "red", fontSize: "11px", margin: 0 }}>{error}</p>}

              <button type="submit" style={{
                marginTop: "10px",
                padding: "12px",
                backgroundColor: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}>
                Login
              </button>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}