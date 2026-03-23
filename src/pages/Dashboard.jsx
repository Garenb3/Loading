import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import MovieCard from "../components/MovieCard";
 
function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(true);
 
  return (
    <section className="dashboard-section">
      <div
        onClick={() => setOpen(prev => !prev)}
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
        }}>
          ▾
        </span>
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
 
  const handleUserUpdate = (updated) => {
    setUser(updated);
  };
 
  const [profileOpen, setProfileOpen] = useState(true);
 
  const [watchlist, setWatchlist] = useState(() =>
    JSON.parse(localStorage.getItem("watchlist") || "[]")
  );
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [recentlyViewed, setRecentlyViewed] = useState(() =>
    JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
  );
 
  const removeFromWatchlist = (id) => {
    const updated = watchlist.filter(m => m.id !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };
 
  const removeFromFavorites = (id) => {
    const updated = favorites.filter(m => m.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };
 
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
 
      <main className="dashboard-layout">
        {/* Profile panel with smooth slide + fade */}
        <div style={{ position: "relative", minHeight: "56px" }}>
          <div
            style={{
              overflow: "hidden",
              maxWidth: profileOpen ? "400px" : "0px",
              opacity: profileOpen ? 1 : 0,
              transition: "max-width 0.35s ease, opacity 0.25s ease",
              pointerEvents: profileOpen ? "auto" : "none",
            }}
          >
            <Profile user={user} onUserUpdate={handleUserUpdate} />
          </div>
 
          <button
            onClick={() => setProfileOpen(prev => !prev)}
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
              zIndex: 10
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
          >
            {profileOpen ? "☚" : "☛"}
          </button>
        </div>
 
        <section className="content-section">
 
          <CollapsibleSection title="My Watchlist">
            {watchlist.length === 0 ? (
              <p>
                No watchlist yet.{" "}
                <Link to="/ListView" style={{ color: "var(--primary)", textDecoration: "underline" }} className="hover:opacity-70">
                  Let's browse!
                </Link>
              </p>
            ) : (
              <div className="card-grid">
                {watchlist.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </CollapsibleSection>
 
          <CollapsibleSection title="Favorites">
            {favorites.length === 0 ? (
              <p>
                No favorites yet.{" "}
                <Link to="/ListView" style={{ color: "var(--primary)", textDecoration: "underline" }} className="hover:opacity-70">
                  Let's browse!
                </Link>
              </p>
            ) : (
              <div className="card-grid">
                {favorites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </CollapsibleSection>
 
          <CollapsibleSection title="Recently Viewed">
            {recentlyViewed.length === 0 ? (
              <p>
                Nothing viewed yet.{" "}
                <Link to="/ListView" style={{ color: "var(--primary)", textDecoration: "underline" }} className="hover:opacity-70">
                  Let's browse!
                </Link>
              </p>
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
 
export default Dashboard;