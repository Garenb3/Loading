import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import MovieCard from "../components/MovieCard";
import { ToastContainer, useToast } from "../components/Toast";

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

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section style={{ marginBottom: "32px" }}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          marginBottom: open ? "16px" : 0,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{title}</h2>
        <span style={{
          fontSize: "18px",
          color: "var(--text)",
          transition: "transform 0.3s ease",
          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          display: "inline-block",
          opacity: 0.6,
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
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  backgroundColor: "rgba(0,0,0,0.65)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 5,
  padding: 0,
};

function Dashboard() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || { username: "Guest", email: "" }; }
    catch { return { username: "Guest", email: "" }; }
  });

  const { toasts, showToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(true);

  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("watchlist") || "[]"); } catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { return []; }
  });
  const [recentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("recentlyViewed") || "[]"); } catch { return []; }
  });

  const removeFromWatchlist = (id) => {
    const updated = watchlist.filter((m) => m.id !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    showToast("Removed from Watchlist", "info");
  };

  const removeFromFavorites = (id) => {
    const updated = favorites.filter((m) => m.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    showToast("Removed from Favorites", "info");
  };

  const browseLink = (
    <Link to="/listview" style={{ color: "var(--primary)", textDecoration: "underline" }}>
      Let&apos;s browse!
    </Link>
  );

  const PANEL_WIDTH = 300;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} />

      {/* Top spacing so content isn't under the hamburger button */}
      <div style={{ paddingTop: "72px" }}>
        <div style={{ display: "flex", minHeight: "calc(100vh - 72px)" }}>

          {/* Sliding profile panel */}
          <aside style={{
            width: profileOpen ? `${PANEL_WIDTH}px` : "0px",
            minWidth: profileOpen ? `${PANEL_WIDTH}px` : "0px",
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "var(--secondary)",
            boxShadow: profileOpen ? "var(--panelShadow)" : "none",
            transition: [
              "width 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
              "min-width 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
              "box-shadow 0.38s ease",
            ].join(", "),
            position: "relative",
            zIndex: 10,
          }}>
            <div style={{ width: `${PANEL_WIDTH}px`, height: "100%" }}>
              <Profile user={user} onUserUpdate={setUser} isGuest={!user.email} />
            </div>
          </aside>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, padding: "24px" }}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              title={profileOpen ? "Close profile panel" : "Open profile panel"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "24px",
                padding: "9px 16px",
                borderRadius: "8px",
                border: "1px solid var(--surfaceBorder)",
                backgroundColor: "var(--surfaceSubtle)",
                color: "var(--text)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "background-color 0.2s, border-color 0.2s",
                width: "auto",
                marginTop: 0,
              }}
            >
              {profileOpen ? <CloseIcon /> : <HamburgerIcon />}
              <span>{profileOpen ? "Hide Profile" : "My Profile"}</span>
            </button>

            <CollapsibleSection title="My Watchlist">
              {watchlist.length === 0 ? (
                <p style={{ color: "var(--text)", opacity: 0.7 }}>No watchlist yet. {browseLink}</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
                  {watchlist.map((movie) => (
                    <div key={movie.id} style={{ position: "relative" }}>
                      <MovieCard movie={movie} />
                      <button onClick={() => removeFromWatchlist(movie.id)} title="Remove" style={removeBtnStyle}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Favorites">
              {favorites.length === 0 ? (
                <p style={{ color: "var(--text)", opacity: 0.7 }}>No favorites yet. {browseLink}</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
                  {favorites.map((movie) => (
                    <div key={movie.id} style={{ position: "relative" }}>
                      <MovieCard movie={movie} />
                      <button onClick={() => removeFromFavorites(movie.id)} title="Remove" style={removeBtnStyle}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Recently Viewed">
              {recentlyViewed.length === 0 ? (
                <p style={{ color: "var(--text)", opacity: 0.7 }}>Nothing viewed yet. {browseLink}</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
                  {recentlyViewed.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;