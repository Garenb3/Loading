import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setTheme } from "../utils/theme";
import profileImg from "../images/Profile.jpg";
import logo from "../images/logo.png";
import { darkTheme, lightTheme } from "../utils/themes";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setTheme(isDark ? lightTheme : darkTheme);
    setIsDark(!isDark);
  };

  const linkStyle = {
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "30px",
  };
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Guest",
  };
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

  const savedPhoto = localStorage.getItem("profilePhoto");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
    >
      <div style={{ margin: 0, padding: 0, width: "125px"}}>
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="BingeBoard Logo"
            style={{
              height: "90px",
              width: "100%",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-end items-center">
        <Link to="/" style={linkStyle} className="hover:opacity-70">
          Home
        </Link>
        <Link to="/listview" style={linkStyle} className="hover:opacity-70">
          Browse
        </Link>
        <Link to="/add" style={linkStyle} className="hover:opacity-70">
          <span
            style={{
              backgroundColor: "var(--primary)",
              color: "#fff",
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "25px",
            }}
          >
            + Add / Edit
          </span>
        </Link>
        <Link to="/login" style={linkStyle} className="hover:opacity-70">
          Login
        </Link>
        <Link to="/dashboard" style={linkStyle} className="hover:opacity-70">
          Dashboard
        </Link>
      </div>

      <div className="flex items-center relative">
        <div className="relative group">
          <img
            src={savedPhoto || profileImg}
            alt="profile"
            className="w-15 h-15 rounded-full object-cover cursor-pointer border"
            style={{ borderColor: "var(--primary)" }}
          />

          {/* Dropdown Card */}
          <div
            className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--text)",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              zIndex: 50,
            }}
          >
            {/* Username */}
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              {user.username}
            </p>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.1)",
                margin: "8px 0",
              }}
            />

            {/* Stats */}
            <div style={{ fontSize: "13px", opacity: 0.85, lineHeight: "1.6" }}>
              <p>🎬 Favorites: {favorites.length}</p>
              <p>📺 Watchlist: {watchlist.length}</p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.1)",
                margin: "12px 0",
              }}
            />

            {/* Theme Switch */}
            <button
              onClick={toggleTheme}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid var(--primary)",
                background: "transparent",
                color: "var(--text)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Switch to {isDark ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "#ff4d4f",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
