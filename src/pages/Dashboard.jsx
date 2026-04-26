import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import MovieCard from "../components/MovieCard";
import { ToastContainer, useToast } from "../components/Toast";
import { authFetch } from "../utils/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Icons ─────────────────────────────────────────────────────
function HamburgerIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
      <rect y="0"  width="18" height="2" rx="1"/>
      <rect y="6"  width="18" height="2" rx="1"/>
      <rect y="12" width="18" height="2" rx="1"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="2" x2="14" y2="14"/>
      <line x1="14" y1="2" x2="2"  y2="14"/>
    </svg>
  );
}

// ── Collapsible Section ───────────────────────────────────────
function CollapsibleSection({ title, count, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section style={{ marginBottom: "32px" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer", userSelect: "none", marginBottom: open ? "16px" : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{title}</h2>
          {count > 0 && (
            <span style={{
              backgroundColor: "var(--primary)", color: "#fff",
              borderRadius: "999px", fontSize: "11px", fontWeight: "700",
              padding: "2px 8px", lineHeight: 1.4,
            }}>{count}</span>
          )}
        </div>
        <span style={{
          fontSize: "18px", color: "var(--text)", opacity: 0.6,
          transition: "transform 0.3s ease", display: "inline-block",
          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
        }}>▾</span>
      </div>
      <div style={{
        overflow: open ? "visible" : "hidden",
        maxHeight: open ? "4000px" : "0px",
        opacity: open ? 1 : 0,
        transition: "max-height 0.4s ease, opacity 0.3s ease",
      }}>
        {children}
      </div>
    </section>
  );
}

const removeBtnStyle = {
  position: "absolute", top: "8px", right: "8px",
  width: "26px", height: "26px", borderRadius: "50%",
  backgroundColor: "rgba(0,0,0,0.65)", color: "#fff",
  border: "none", cursor: "pointer", fontSize: "12px",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 5, padding: 0,
};

// ── Helper: fetch full media objects from API by numeric IDs ──
async function resolveMediaFromAPI(ids) {
  if (!ids || ids.length === 0) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/media`);
    if (!response.ok) return [];
    const allMedia = await response.json();
    return ids
      .map((id) => allMedia.find((m) => String(m.id) === String(id)))
      .filter(Boolean);
  } catch {
    return [];
  }
}

const PROFILE_WIDTH = 260;

function Dashboard() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || { username: "Guest", email: "" }; }
    catch { return { username: "Guest", email: "" }; }
  });

  const { toasts, showToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(true);

  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");

  const userId = user?._id;
  const isGuest = !user?.email;

  // ── Fetch user data + resolve media from API ──────────────
  const fetchUserData = useCallback(async () => {
    if (isGuest || !userId) { setLoadingData(false); return; }
    try {
      setLoadingData(true);
      setDataError("");

      // Get user's lists of IDs
      const userData = await authFetch(`/user/${userId}`);

      // Resolve IDs → full media objects via API (no Data.js)
      const [resolvedWatchlist, resolvedFavorites, resolvedRecent] = await Promise.all([
        resolveMediaFromAPI(userData.watchlist),
        resolveMediaFromAPI(userData.favorites),
        resolveMediaFromAPI(userData.recentlyViewed),
      ]);

      setWatchlist(resolvedWatchlist);
      setFavorites(resolvedFavorites);
      setRecentlyViewed(resolvedRecent);
    } catch {
      setDataError("Failed to load your data. Please refresh.");
    } finally {
      setLoadingData(false);
    }
  }, [userId, isGuest]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // ── Remove from watchlist ─────────────────────────────────
  const removeFromWatchlist = async (mediaId) => {
    try {
      await authFetch(`/user/${userId}/watchlist/${mediaId}`, "DELETE");
      setWatchlist((prev) => prev.filter((m) => String(m.id) !== String(mediaId)));
      showToast("Removed from Watchlist", "info");
    } catch {
      showToast("Failed to remove item", "error");
    }
  };

  // ── Remove from favorites ─────────────────────────────────
  const removeFromFavorites = async (mediaId) => {
    try {
      await authFetch(`/user/${userId}/favorites/${mediaId}`, "DELETE");
      setFavorites((prev) => prev.filter((m) => String(m.id) !== String(mediaId)));
      showToast("Removed from Favorites", "info");
    } catch {
      showToast("Failed to remove item", "error");
    }
  };

  const browseLink = (
    <Link to="/listview" style={{ color: "var(--primary)", textDecoration: "underline" }}>
      Let&apos;s browse!
    </Link>
  );

  if (loadingData) {
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <p style={{ opacity: 0.6 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} />

      {profileOpen && (
        <Profile user={user} onUserUpdate={setUser} isGuest={isGuest} />
      )}

      <div style={{
        marginLeft: profileOpen ? `${PROFILE_WIDTH}px` : "0px",
        transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        padding: "clamp(16px, 3vw, 32px)",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}>

        {/* Profile toggle button */}
        <button
          onClick={() => setProfileOpen((p) => !p)}
          title={profileOpen ? "Close profile panel" : "Open profile panel"}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: "8px", marginBottom: "24px", padding: "9px 16px",
            borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)",
            backgroundColor: "rgba(255,255,255,0.06)", color: "var(--text)",
            cursor: "pointer", fontSize: "13px", fontWeight: "600",
            width: "auto", marginTop: 0,
          }}
        >
          {profileOpen ? <CloseIcon /> : <HamburgerIcon />}
          <span>{profileOpen ? "Hide Profile" : "My Profile"}</span>
        </button>

        {/* Guest warning */}
        {isGuest && (
          <div style={{
            padding: "16px 20px", borderRadius: "10px", marginBottom: "24px",
            backgroundColor: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)",
            fontSize: "14px",
          }}>
            You're browsing as a guest.{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>Log in</Link>
            {" "}to save your watchlist and favorites.
          </div>
        )}

        {/* Error banner */}
        {dataError && (
          <div style={{
            padding: "12px 16px", borderRadius: "8px", marginBottom: "20px",
            backgroundColor: "rgba(255,77,79,0.12)", border: "1px solid rgba(255,77,79,0.35)",
            color: "#ff4d4f", fontSize: "14px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>⚠️ {dataError}</span>
            <button onClick={fetchUserData} style={{
              background: "none", border: "1px solid #ff4d4f", borderRadius: "6px",
              color: "#ff4d4f", cursor: "pointer", fontSize: "12px",
              padding: "4px 10px", width: "auto", marginTop: 0,
            }}>Retry</button>
          </div>
        )}

        {/* Watchlist */}
        <CollapsibleSection title="My Watchlist" count={watchlist.length}>
          {watchlist.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No watchlist yet. {browseLink}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
              {watchlist.map((movie) => (
                <div key={movie._id || movie.id} style={{ position: "relative" }}>
                  <MovieCard movie={movie} />
                  <button onClick={() => removeFromWatchlist(movie.id)} title="Remove" style={removeBtnStyle}>✕</button>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* Favorites */}
        <CollapsibleSection title="Favorites" count={favorites.length}>
          {favorites.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No favorites yet. {browseLink}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
              {favorites.map((movie) => (
                <div key={movie._id || movie.id} style={{ position: "relative" }}>
                  <MovieCard movie={movie} />
                  <button onClick={() => removeFromFavorites(movie.id)} title="Remove" style={removeBtnStyle}>✕</button>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* Recently Viewed */}
        <CollapsibleSection title="Recently Viewed" count={recentlyViewed.length}>
          {recentlyViewed.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Nothing viewed yet. {browseLink}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
              {recentlyViewed.map((movie) => (
                <MovieCard key={movie._id || movie.id} movie={movie} />
              ))}
            </div>
          )}
        </CollapsibleSection>

      </div>
    </div>
  );
}

export default Dashboard;