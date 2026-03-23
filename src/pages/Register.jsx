import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../images/logo.png";

function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      event.target.confirmPassword.value = "";
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    setError("");
    alert("Registered successfully!");
    navigate("/dashboard");
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
              style={{ width: "120px", height: "120px", objectFit: "cover",}}
            />
            <h1 style={{ fontSize: "22px", fontWeight: "bold", textAlign: "center", margin: 0 , color: "var(--primary)", }}>
              BingeBoard
            </h1>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
              Track what you watch. <br /> Save what you love.
            </p>


            {/* Divider */}
            <div style={{ width: "60%", height: "1px", backgroundColor: "var(--text)", opacity: "0.5", margin: "4px 0" }} />

            <h2 style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", margin: 0 }}>
              Create Account
            </h2>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
              Join us today — it's free!
            </p>

            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
                Already have an account?{" "}
                <Link to="/Login" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Login here
                </Link>
            </p>

          </div>

          {/* Right Panel — Form only */}
            <div style={{
            flex: 1.3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "32px 36px",
            overflowY: "auto",
            maxHeight: "100%"
            }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                <label htmlFor="username" style={{ fontSize: "13px", opacity: 0.9, fontWeight: "600" }}>Username</label>
                <input type="text" id="username" name="username" placeholder="enter your username" required
                style={{ padding: "11px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.09)", color: "var(--text)", fontSize: "14px" }}
                />

                <label htmlFor="email" style={{ fontSize: "13px", opacity: 0.9, fontWeight: "600" }}>Email</label>
                <input type="email" id="email" name="email" placeholder="example@email.com" required
                style={{ padding: "11px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.09)", color: "var(--text)", fontSize: "14px" }}
                />

                <label htmlFor="password" style={{ fontSize: "13px", opacity: 0.9, fontWeight: "600" }}>Password</label>
                <input type="password" id="password" name="password" placeholder="at least 6 characters" minLength="6" required
                style={{ padding: "11px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.09)", color: "var(--text)", fontSize: "14px" }}
                />
                {error && <p style={{ color: "red", fontSize: "11px", margin: "0" }}>{error}</p>}

                <label htmlFor="confirmPassword" style={{ fontSize: "13px", opacity: 0.9, fontWeight: "600" }}>Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="rewrite password" required
                style={{ padding: "11px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.09)", color: "var(--text)", fontSize: "14px" }}
                />

                <button type="submit" style={{
                marginTop: "10px", padding: "12px",
                backgroundColor: "var(--primary)", color: "#fff",
                border: "none", borderRadius: "8px",
                fontWeight: "bold", fontSize: "15px", cursor: "pointer"
                }}>
                Register
                </button>
            </form>
            </div>
        </div>
      </main>
    </div>
  );
}

export default Register;