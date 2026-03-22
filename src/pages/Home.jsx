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

  const allFeatured = data.filter(m => m.featured);
  const allTrending = data.filter(m => m.trending);

  const featured = showAllFeatured ? allFeatured : allFeatured.slice(0, ITEMS_PER_2_ROWS);
  const trending = showAllTrending ? allTrending : allTrending.slice(0, ITEMS_PER_2_ROWS);

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />

      <section className="px-6 py-12 text-center" style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
        <h1 className="text-3xl md:text-5xl font-bold">Track Your Favorite Movies</h1>
        <p className="mt-4 text-sm md:text-lg opacity-90">
          Organize, discover, and save movies you love.
        </p>
      </section>

      {/* Featured Section */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2 ref={featuredRef} className="text-2xl font-bold mb-6 text-left">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>

        {allFeatured.length > ITEMS_PER_2_ROWS && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (showAllFeatured) {
                  setShowAllFeatured(false);
                  featuredRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setShowAllFeatured(true);
                }
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-current opacity-70 hover:opacity-100 transition"
              style={{
                color: "var(--text)",
                borderColor: "var(--text)",
                background: "transparent",
                width: "fit-content",
              }}
            >
              <span>{showAllFeatured ? "Show Less" : "Show More"}</span>
              <span style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
                transform: showAllFeatured ? "rotate(180deg)" : "rotate(0deg)"
              }}>▼</span>
            </button>
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2 ref={trendingRef} className="text-2xl font-bold mb-6 text-left">Trending</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>

        {allTrending.length > ITEMS_PER_2_ROWS && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (showAllTrending) {
                  setShowAllTrending(false);
                  trendingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setShowAllTrending(true);
                }
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-current opacity-70 hover:opacity-100 transition"
              style={{
                color: "var(--text)",
                borderColor: "var(--text)",
                background: "transparent",
                width: "fit-content",
              }}
            >
              <span>{showAllTrending ? "Show Less" : "Show More"}</span>
              <span style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
                transform: showAllTrending ? "rotate(180deg)" : "rotate(0deg)"
              }}>▼</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}