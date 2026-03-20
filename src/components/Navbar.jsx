import { setTheme } from "../utils/theme"
import { darkTheme, lightTheme } from "../utils/themes"

export default function Navbar() {
  const handleThemeChange = (e) => {
    if (e.target.value === "dark") setTheme(darkTheme)
    if (e.target.value === "light") setTheme(lightTheme)
  }

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
    >
      <h1 className="text-xl font-bold">MovieTracker</h1>

      <div className="flex flex-wrap gap-4 justify-center md:justify-end">
        <a href="/" className="hover:opacity-70">Home</a>
        <a href="/browse" className="hover:opacity-70">Browse</a>
        <a href="/watchlist" className="hover:opacity-70">Watchlist</a>
        <a href="/login" className="hover:opacity-70">Login</a>
        <a href="/Register" className="hover:opacity-70">Register</a>
        <a href="/Dashboard" className="hover:opacity-70">Dashboard</a>
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