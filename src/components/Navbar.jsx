import { useState } from "react";
import { Link } from "react-router-dom";
import { setTheme } from "../utils/theme";
import { darkTheme, lightTheme } from "../utils/themes";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setTheme(isDark ? lightTheme : darkTheme);
    setIsDark(!isDark);
  };

  const linkStyle = { color: "var(--text)", textDecoration: "none" };

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
    >
      <Link to="/" style={linkStyle}>
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>BingeBoard</h1>
      </Link>

      <div className="flex flex-wrap gap-4 justify-center md:justify-end items-center">
        <Link to="/" style={linkStyle} className="hover:opacity-70">Home</Link>
        <Link to="/listview" style={linkStyle} className="hover:opacity-70">Browse</Link>
        <Link to="/tv" style={linkStyle} className="hover:opacity-70">TV Shows</Link>
        <Link to="/add" style={linkStyle} className="hover:opacity-70">
          <span
            style={{
              backgroundColor: "var(--primary)", color: "#fff",
              padding: "5px 12px", borderRadius: "6px", fontSize: "14px"
            }}
          >
            + Add / Edit
          </span>
        </Link>
        <Link to="/login" style={linkStyle} className="hover:opacity-70">Login</Link>
        <Link to="/dashboard" style={linkStyle} className="hover:opacity-70">Dashboard</Link>
      </div>

      <button
        onClick={toggleTheme}
        className="text-sm px-2 py-1 rounded-md"
        style={{
          background: "transparent",
          color: "var(--text)",
          border: "1px solid var(--primary)",
          cursor: "pointer",
          width: "auto",
          flex: "0 0 auto"
        }}
      >
        {isDark ? "Light" : "Dark"}
      </button>
    </nav>
  );
}