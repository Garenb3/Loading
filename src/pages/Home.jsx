import { useState, useRef } from "react";
import { data } from "../data/Data";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";

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
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #000) 100%)",
          color: "#ffffff",         /* Always white on the coloured hero */
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "clamp(24px, 5vw, 48px)", fontWeight: "800", margin: 0, lineHeight: 1.2 }}>
          Track Your Favorite Movies
        </h1>
        <p style={{ marginTop: "16px", fontSize: "clamp(14px, 2vw, 18px)", opacity: 0.9, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          Organize, discover, and save movies & series you love.
        </p>
      </section>

      {/* Featured Section */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2
          ref={featuredRef}
          style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "var(--text)" }}
        >
          Featured
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {allFeatured.length > ITEMS_PER_2_ROWS && (
          <div className="flex justify-center mt-6">
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
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2
          ref={trendingRef}
          style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "var(--text)" }}
        >
          🔥 Trending
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {allTrending.length > ITEMS_PER_2_ROWS && (
          <div className="flex justify-center mt-6">
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
  color: "var(--text)",           /* Uses theme text → readable in both modes */
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  opacity: 0.75,
  transition: "opacity 0.2s",
};
