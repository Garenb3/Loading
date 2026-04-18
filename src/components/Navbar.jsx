import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setTheme } from "../utils/theme";
import profileImg from "../images/Profile.jpg";
import logo from "../images/logo.png";
import { darkTheme, lightTheme } from "../utils/themes";

/* ── Sun icon ─────────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

/* ── Moon icon ─────────────────────────────────────────────── */
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

/* ── Hamburger icon ───────────────────────────────────────── */
function HamburgerIcon({ open }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (!saved) return true;
    const theme = JSON.parse(saved);
    return theme.bg === darkTheme.bg;
  });

  const [savedPhoto, setSavedPhoto] = useState(() => localStorage.getItem("profilePhoto"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!(user && user.email);

  useEffect(() => {
    const handleStorage = () => {
      setSavedPhoto(localStorage.getItem("profilePhoto"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(isDark ? lightTheme : darkTheme);
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("watchlist");
    localStorage.removeItem("favorites");
    localStorage.removeItem("recentlyViewed");
    localStorage.removeItem("profilePhoto");
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

  const linkStyle = {
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    opacity: 0.85,
    transition: "opacity 0.2s",
  };

  const navLinks = (
    <>
      <Link to="/" style={linkStyle} className="hover:opacity-100">Home</Link>
      <Link to="/listview" style={linkStyle} className="hover:opacity-100">Browse</Link>
      {isLoggedIn && (
        <Link to="/add" style={{ ...linkStyle, opacity: 1 }}>
          <span style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
          }}>
            + Add / Edit
          </span>
        </Link>
      )}
      {!isLoggedIn && (
        <Link to="/login" style={linkStyle} className="hover:opacity-100">Login</Link>
      )}
      {isLoggedIn && (
        <Link to="/dashboard" style={linkStyle} className="hover:opacity-100">Dashboard</Link>
      )}
    </>
  );

  return (
    <nav style={{ backgroundColor: "var(--secondary)", color: "var(--text)", position: "relative", zIndex: 100 }}>
      {/* Main bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "70px",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img
            src={logo}
            alt="BingeBoard Logo"
            style={{ height: "52px", width: "auto", objectFit: "contain", imageRendering: "crisp-edges" }}
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {navLinks}
        </div>

        {/* Right side: theme + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme toggle icon button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text)",
              transition: "background 0.2s",
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Profile avatar with dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img
              src={savedPhoto || profileImg}
              alt="profile"
              onClick={() => setDropdownOpen((p) => !p)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
                border: "2px solid var(--primary)",
              }}
            />

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 10px)",
                width: "220px",
                backgroundColor: "var(--secondary)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "16px",
                zIndex: 200,
              }}>
                {isLoggedIn ? (
                  <>
                    <p style={{ fontWeight: "bold", fontSize: "14px", textAlign: "center", marginBottom: "8px" }}>
                      {user.username}
                    </p>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
                    <div style={{ fontSize: "13px", opacity: 0.8, lineHeight: "1.7" }}>
                      <p>🎬 Favorites: {favorites.length}</p>
                      <p>📺 Watchlist: {watchlist.length}</p>
                    </div>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "12px 0" }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "transparent",
                        color: "#ff4d4f",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "13px", textAlign: "center", opacity: 0.7, marginBottom: "12px" }}>
                      You're not logged in
                    </p>
                    <Link to="/login" style={{ textDecoration: "none" }} onClick={() => setDropdownOpen(false)}>
                      <button style={{
                        width: "100%", padding: "8px", borderRadius: "8px",
                        backgroundColor: "var(--primary)", color: "#fff",
                        border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "13px"
                      }}>
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setMobileOpen((p) => !p)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              cursor: "pointer",
              display: "none", // overridden by tailwind md:flex / flex
              padding: "4px",
            }}
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: mobileOpen ? "400px" : "0px",
          opacity: mobileOpen ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.25s ease",
          borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          padding: "12px 24px 20px",
          gap: "16px",
        }}>
          {navLinks}
        </div>
      </div>

      {/* Inline responsive style for hamburger */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; }
          .desktop-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
