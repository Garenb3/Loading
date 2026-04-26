import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Sidebar from "../components/Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ITEMS_PER_2_ROWS = 8;

export default function Home() {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showAllTrending, setShowAllTrending] = useState(false);

  const featuredRef = useRef(null);
  const trendingRef = useRef(null);

  // ── Fetch from API ────────────────────────────────────────
  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/media`);
        if (!response.ok) throw new Error("Failed to fetch media");
        const data = await response.json();
        setAllMedia(data);
      } catch (err) {
        setError(err.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const allFeatured = allMedia.filter((m) => m.featured);
  const allTrending = allMedia.filter((m) => m.trending);

  const featured = showAllFeatured ? allFeatured : allFeatured.slice(0, ITEMS_PER_2_ROWS);
  const trending = showAllTrending ? allTrending : allTrending.slice(0, ITEMS_PER_2_ROWS);

  const movies = allMedia.filter((m) => m.type === "movie").length;
  const series = allMedia.filter((m) => m.type === "series").length;

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <p style={{ opacity: 0.6 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", gap: "16px" }}>
          <p style={{ color: "#ef4444" }}>⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px", borderRadius: "8px",
              backgroundColor: "var(--primary)", color: "#fff",
              border: "none", cursor: "pointer", fontWeight: "600",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />

      {/* ── Hero Banner ── */}
      <section style={{
        background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)",
        color: "#ffffff",
        padding: "clamp(10px, 2vw, 25px) clamp(16px, 6vw, 48px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-40px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "clamp(11px, 1.5vw, 13px)", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.75, marginBottom: "12px" }}>
            Your Personal Cinema
          </p>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 56px)",color: "var(--text2)", fontWeight: "800", margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Track Your Favorite
            <br />
            Movies &amp; Series
          </h1>
          <p style={{ marginTop: "16px", fontSize: "clamp(14px, 2vw, 18px)", opacity: 0.85, maxWidth: "400px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, color: "var(--text2)" }}>
            Organize, discover, and save everything you love all in one place.
          </p>

          {/* Stats row — live from API */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 5vw, 48px)", marginTop: "25px", flexWrap: "wrap" }}>
            {[
              { value: `${allMedia.length}+`, label: "Titles" },
              { value: `${movies}`, label: "Movies" },
              { value: `${series}`, label: "Series" },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "800", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Section ── */}
      <section style={{ padding: "32px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
          <h2 ref={featuredRef} style={{ fontSize: "22px", fontWeight: "700", margin: 0, padding: "5px 20px",borderRadius: "15px", backgroundColor: "var(--primary)", color: "var(--text2)" }}>
            ⭐ Featured
          </h2>
          <Link to="/listview" style={{ fontSize: "13px", color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
            View All →
          </Link>
        </div>

        {allFeatured.length === 0 ? (
          <p style={{ opacity: 0.5 }}>No featured titles available.</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
              {featured.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
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
          </>
        )}
      </section>

      {/* ── Trending Section ── */}
      <section style={{ padding: "0 24px 48px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
          <h2 ref={trendingRef} style={{ fontSize: "22px", fontWeight: "700", margin: 0, padding: "5px 20px",borderRadius: "15px", backgroundColor: "var(--primary)", color: "var(--text2)" }}>
            🔥 Trending
          </h2>
          <Link to="/listview" style={{ fontSize: "13px", color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
            View All →
          </Link>
        </div>

        {allTrending.length === 0 ? (
          <p style={{ opacity: 0.5 }}>No trending titles available.</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
              {trending.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
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
          </>
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