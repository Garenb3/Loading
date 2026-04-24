import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setTheme } from "../utils/theme";
import profileImg from "../images/Profile.jpg";
import logo from "../images/logo.png";
import { darkTheme, lightTheme } from "../utils/themes";

/* ── Icons ──────────────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function BrowseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 2l-4 5-4-5"/>
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

/* ── Sidebar ────────────────────────────────────────────────── */
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (!saved) return true;
    try { return JSON.parse(saved).bg === darkTheme.bg; } catch { return true; }
  });
  const [savedPhoto, setSavedPhoto] = useState(() => localStorage.getItem("profilePhoto"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!(user && user.email);
  const favorites = (() => { try { return JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { return []; } })();
  const watchlist = (() => { try { return JSON.parse(localStorage.getItem("watchlist") || "[]"); } catch { return []; } })();

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Sync user state when localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      setSavedPhoto(localStorage.getItem("profilePhoto"));
      try { setUser(JSON.parse(localStorage.getItem("user") || "null")); } catch { setUser(null); }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleTheme = () => {
    const next = isDark ? lightTheme : darkTheme;
    setTheme(next);
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    ["user", "watchlist", "favorites", "recentlyViewed", "profilePhoto"].forEach(
      (k) => localStorage.removeItem(k)
    );
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (to, icon, label, accent = false) => (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 16px",
        borderRadius: "10px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: isActive(to) ? "700" : "500",
        color: isActive(to) ? "#fff" : "var(--text)",
        backgroundColor: isActive(to)
          ? "var(--primary)"
          : accent
          ? "rgba(var(--primary-rgb, 229,57,53), 0.12)"
          : "transparent",
        transition: "background 0.18s, color 0.18s",
        opacity: isActive(to) ? 1 : 0.85,
      }}
      onMouseEnter={(e) => {
        if (!isActive(to)) e.currentTarget.style.backgroundColor = "rgba(128,128,128,0.12)";
      }}
      onMouseLeave={(e) => {
        if (!isActive(to)) e.currentTarget.style.backgroundColor = accent ? "rgba(var(--primary-rgb,229,57,53),0.12)" : "transparent";
      }}
    >
      <span style={{ opacity: isActive(to) ? 1 : 0.7, flexShrink: 0 }}>{icon}</span>
      {label}
    </Link>
  );

  return (
    <>
      {/* ── Floating hamburger button ─────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1000,
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          backgroundColor: "var(--secondary)",
          border: "1px solid rgba(128,128,128,0.2)",
          color: "var(--text)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          transition: "box-shadow 0.2s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.35)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.25)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <MenuIcon />
      </button>

      {/* ── Backdrop ─────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(3px)",
          zIndex: 1001,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── Drawer ───────────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "280px",
          backgroundColor: "var(--secondary)",
          borderRight: "1px solid rgba(128,128,128,0.15)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.3)",
          zIndex: 1002,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(128,128,128,0.12)",
          flexShrink: 0,
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src={logo} alt="BingeBoard" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
            <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--primary)", letterSpacing: "-0.3px" }}>
              BingeBoard
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              background: "rgba(128,128,128,0.1)",
              border: "none",
              borderRadius: "8px",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* User profile strip */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(128,128,128,0.12)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}>
          <img
            src={savedPhoto || profileImg}
            alt="profile"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--primary)",
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            {isLoggedIn ? (
              <>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.username}
                </p>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </p>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.6 }}>Not logged in</p>
            )}
          </div>
        </div>

        {/* Stats (logged in only) */}
        {isLoggedIn && (
          <div style={{
            display: "flex",
            gap: "8px",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(128,128,128,0.12)",
            flexShrink: 0,
          }}>
            {[
              { label: "Watchlist", count: watchlist.length, emoji: "📺" },
              { label: "Favorites", count: favorites.length, emoji: "🎬" },
            ].map(({ label, count, emoji }) => (
              <div key={label} style={{
                flex: 1,
                backgroundColor: "rgba(128,128,128,0.08)",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--primary)" }}>{count}</p>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>{emoji} {label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: "12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItem("/", <HomeIcon />, "Home")}
          {navItem("/listview", <BrowseIcon />, "Browse")}
          {isLoggedIn && navItem("/dashboard", <DashboardIcon />, "Dashboard")}
          {isLoggedIn && navItem("/add", <AddIcon />, "Add / Edit", true)}
          {!isLoggedIn && navItem("/login", <LoginIcon />, "Login")}
        </nav>

        {/* Bottom: theme toggle + logout */}
        <div style={{
          padding: "12px 12px 20px",
          borderTop: "1px solid rgba(128,128,128,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0,
        }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "rgba(128,128,128,0.08)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              width: "100%",
              textAlign: "left",
            }}
          >
            <span style={{ opacity: 0.7 }}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(255,77,79,0.3)",
                backgroundColor: "rgba(255,77,79,0.08)",
                color: "#ff4d4f",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                width: "100%",
                textAlign: "left",
              }}
            >
              <LogoutIcon />
              Log Out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}