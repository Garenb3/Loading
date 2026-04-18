import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import logo from "../images/logo.png";

// Basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function Register() {
  const [errors, setErrors] = useState({});
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    const newErrors = {};

    if (!username) newErrors.username = "Username is required";

    if (!isValidEmail(email)) newErrors.email = "Enter a valid email address (e.g. user@example.com)";

    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password) && !/[0-9]/.test(password))
      newErrors.password = "Password should include a number or uppercase letter";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    showToast("Registered successfully! Redirecting…", "success");
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
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
          flexWrap: "wrap",
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
            <img src={logo} alt="BingeBoard logo" style={{ width: "100px", height: "100px", objectFit: "contain" }} />
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "var(--primary)" }}>
              BingeBoard
            </h1>
            <p style={{ fontSize: "12px", textAlign: "center", margin: 0, opacity: 0.65 }}>
              Track what you watch.<br />Save what you love.
            </p>
            <div style={{ width: "60%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Create Account</h2>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.65 }}>Join us today — it's free!</p>
            <p style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Login here
              </Link>
            </p>
          </div>

          {/* Right Panel */}
          <div style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 36px",
            overflowY: "auto",
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              <label style={labelStyle}>Username</label>
              <input
                type="text" name="username" placeholder="enter your username" required
                onChange={() => clearError("username")}
                style={{ ...inputStyle, borderColor: errors.username ? "#ef4444" : "rgba(255,255,255,0.2)" }}
              />
              {errors.username && <FieldError msg={errors.username} />}

              <label style={labelStyle}>Email</label>
              <input
                type="email" name="email" placeholder="example@email.com" required
                onChange={() => clearError("email")}
                style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : "rgba(255,255,255,0.2)" }}
              />
              {errors.email && <FieldError msg={errors.email} />}

              <label style={labelStyle}>Password</label>
              <input
                type="password" name="password" placeholder="at least 6 characters" minLength="6" required
                onChange={() => clearError("password")}
                style={{ ...inputStyle, borderColor: errors.password ? "#ef4444" : "rgba(255,255,255,0.2)" }}
              />
              {errors.password && <FieldError msg={errors.password} />}

              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password" name="confirmPassword" placeholder="rewrite password" required
                onChange={() => clearError("confirmPassword")}
                style={{ ...inputStyle, borderColor: errors.confirmPassword ? "#ef4444" : "rgba(255,255,255,0.2)" }}
              />
              {errors.confirmPassword && <FieldError msg={errors.confirmPassword} />}

              <button
                type="submit"
                style={{
                  marginTop: "12px", padding: "12px",
                  backgroundColor: "var(--primary)", color: "#fff",
                  border: "none", borderRadius: "8px",
                  fontWeight: "bold", fontSize: "15px", cursor: "pointer"
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function FieldError({ msg }) {
  return <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>{msg}</p>;
}

const labelStyle = { fontSize: "13px", fontWeight: "600", opacity: 0.9 };
const inputStyle = {
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
};

export default Register;
