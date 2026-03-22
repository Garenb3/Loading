import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import MovieCard from "../components/MovieCard";

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
        <div style={{ position: "relative", minHeight: "56px" }}>
          {profileOpen && <Profile user={user} onUserUpdate={handleUserUpdate} />}
          
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

          {/* Watchlist */}
          <section className="dashboard-section">
            <h2>My Watchlist</h2>
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
          </section>

          {/* Favorites */}
          <section className="dashboard-section">
            <h2>Favorites</h2>
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
          </section>

          {/* Recently Viewed */}
          <section className="dashboard-section">
            <h2>Recently Viewed</h2>
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
          </section>

        </section>
      </main>
    </div>
  );
}

export default Dashboard;