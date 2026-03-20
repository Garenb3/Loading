import { setTheme } from "../utils/theme";
import { darkTheme, lightTheme } from "../utils/themes";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    if (isDark) {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
    setIsDark(!isDark);
  };

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
    >
      <h1 className="text-xl font-bold">MovieTracker</h1>

      <div className="flex flex-wrap gap-4 justify-center md:justify-end">
        <Link to="/" className="hover:opacity-70">Home</Link>
        <Link to="/browse" className="hover:opacity-70">Browse</Link>
        <Link to="/watchlist" className="hover:opacity-70">Watchlist</Link>
        <Link to="/login" className="hover:opacity-70">Login</Link>
        <Link to="/Register" className="hover:opacity-70">Register</Link>
        <Link to="/Dashboard" className="hover:opacity-70">Dashboard</Link>
      </div>

      <button
        onClick={toggleTheme}
        className="px-2 py-1 rounded"
        style={{ backgroundColor: "var(--primary)", color: "#fff" }}
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}