import { setTheme } from "../utils/theme";
import { darkTheme, lightTheme } from "../utils/themes";
import { Link } from "react-router-dom";

export default function Navbar() {
  const handleThemeChange = (e) => {
    if (e.target.value === "dark") setTheme(darkTheme);
    if (e.target.value === "light") setTheme(lightTheme);
  }

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
        <Link to="/add" className="hover:opacity-70">Add</Link>
        <Link to="/tv" className="hover:opacity-70">TV Shows</Link>
      </div>

      <select
        onChange={handleThemeChange}
        className="px-2 py-1 rounded"
        style={{ backgroundColor: "var(--primary)", color: "#fff" }}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </nav>
  )
}