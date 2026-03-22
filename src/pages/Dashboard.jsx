import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import MovieCard from "../components/MovieCard";

function Dashboard() {
  const [user] = useState({
    username: "Lyn",
    email: "lyn@example.com",
  });

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
        <Profile user={user} />

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