import { useState, useRef } from "react";
import { data } from "../data/Data";
import MovieCard from "../components/MovieCard";
import Sidebar from "../components/Sidebar";

const ITEMS_PER_2_ROWS = 8;

export default function Home() {
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showAllTrending, setShowAllTrending] = useState(false);

  const featuredRef = useRef(null);
  const trendingRef = useRef(null);

  const allFeatured = data.filter((m) => m.featured);
  const allTrending = data.filter((m) => m.trending);

  const featured = showAllFeatured ? allFeatured : allFeatured.slice(0, ITEMS_PER_2_ROWS);
  const trending = showAllTrending ? allTrending : allTrending.slice(0, ITEMS_PER_2_ROWS);

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />

      {/* Hero Banner — extra top padding so hamburger button doesn't overlap */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #000) 100%)",
          color: "#ffffff",
          padding: "80px 24px 64px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "clamp(24px, 5vw, 48px)", fontWeight: "800", margin: 0, lineHeight: 1.2, color: "#ffffff" }}>
          Track Your Favorite Movies
        </h1>
        <p style={{ marginTop: "16px", fontSize: "clamp(14px, 2vw, 18px)", opacity: 0.9, maxWidth: "500px", margin: "16px auto 0" }}>
          Organize, discover, and save movies &amp; series you love.
        </p>
      </section>

      {/* Featured Section */}
      <section style={{ padding: "32px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        <h2 ref={featuredRef} style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "var(--text)" }}>
          Featured
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
          {featured.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {allFeatured.length > ITEMS_PER_2_ROWS && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
            <button
              onClick={() => {
                if (showAllFeatured) {
                  setShowAllFeatured(false);
                  featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setShowAllFeatured(true);
                }
              }}
              style={showMoreBtnStyle}
            >
              {showAllFeatured ? "Show Less ▲" : "Show More ▼"}
            </button>
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section style={{ padding: "0 24px 48px", maxWidth: "1280px", margin: "0 auto" }}>
        <h2 ref={trendingRef} style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "var(--text)" }}>
          🔥 Trending
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {allTrending.length > ITEMS_PER_2_ROWS && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
            <button
              onClick={() => {
                if (showAllTrending) {
                  setShowAllTrending(false);
                  trendingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setShowAllTrending(true);
                }
              }}
              style={showMoreBtnStyle}
            >
              {showAllTrending ? "Show Less ▲" : "Show More ▼"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

const showMoreBtnStyle = {
  padding: "9px 28px",
  borderRadius: "999px",
  border: "1px solid var(--text)",
  background: "transparent",
  color: "var(--text)",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  opacity: 0.75,
  transition: "opacity 0.2s",
};