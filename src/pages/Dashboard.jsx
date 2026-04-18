import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import MovieCard from "../components/MovieCard";
import { ToastContainer, useToast } from "../components/Toast";

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="dashboard-section">
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        <span style={{
          fontSize: "20px",
          color: "var(--text)",
          transition: "transform 0.3s ease",
          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          display: "inline-block",
        }}>▾</span>
      </div>

      <div style={{
        overflow: "hidden",
        maxHeight: open ? "2000px" : "0px",
        opacity: open ? 1 : 0,
        transition: "max-height 0.4s ease, opacity 0.3s ease",
        marginTop: open ? "12px" : "0px",
      }}>
        {children}
      </div>
    </section>
  );
}

function Dashboard() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : { username: "Guest", email: "" };
  });

  const { toasts, showToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(true);

  const [watchlist, setWatchlist] = useState(() =>
    JSON.parse(localStorage.getItem("watchlist") || "[]")
  );
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [recentlyViewed] = useState(() =>
    JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
  );

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
    <Link to="/listview" style={{ color: "var(--primary)", textDecoration: "underline" }} className="hover:opacity-70">
      Let's browse!
    </Link>
  );

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer toasts={toasts} />

      <main className="dashboard-layout">
        {/* Profile panel */}
        <div style={{ position: "relative", minHeight: "56px" }}>
          <div style={{
            overflow: "hidden",
            maxWidth: profileOpen ? "400px" : "0px",
            opacity: profileOpen ? 1 : 0,
            transition: "max-width 0.35s ease, opacity 0.25s ease",
            pointerEvents: profileOpen ? "auto" : "none",
          }}>
            <Profile user={user} onUserUpdate={setUser} isGuest={!user.email} />
          </div>

          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            style={{
              position: "absolute",
              top: "12px",
              right: "-15px",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              color: "var(--text)",
              transition: "background-color 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
          >
            {profileOpen ? "☚" : "☛"}
          </button>
        </div>

        <section className="content-section">
          <CollapsibleSection title="My Watchlist">
            {watchlist.length === 0 ? (
              <p>No watchlist yet. {browseLink}</p>
            ) : (
              <div className="card-grid">
                {watchlist.map((movie) => (
                  <div key={movie.id} style={{ position: "relative" }}>
                    <MovieCard movie={movie} />
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      title="Remove from watchlist"
                      style={removeBtnStyle}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Favorites">
            {favorites.length === 0 ? (
              <p>No favorites yet. {browseLink}</p>
            ) : (
              <div className="card-grid">
                {favorites.map((movie) => (
                  <div key={movie.id} style={{ position: "relative" }}>
                    <MovieCard movie={movie} />
                    <button
                      onClick={() => removeFromFavorites(movie.id)}
                      title="Remove from favorites"
                      style={removeBtnStyle}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Recently Viewed">
            {recentlyViewed.length === 0 ? (
              <p>Nothing viewed yet. {browseLink}</p>
            ) : (
              <div className="card-grid">
                {recentlyViewed.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </CollapsibleSection>
        </section>
      </main>
    </div>
  );
}

const removeBtnStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  backgroundColor: "rgba(0,0,0,0.7)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 5,
  lineHeight: 1,
};

export default Dashboard;
