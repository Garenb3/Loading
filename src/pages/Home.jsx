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

  const featured = showAllFeatured
    ? allFeatured
    : allFeatured.slice(0, ITEMS_PER_2_ROWS);
  const trending = showAllTrending
    ? allTrending
    : allTrending.slice(0, ITEMS_PER_2_ROWS);

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      {/* ── Hero Banner ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)",
          color: "#ffffff",
          padding: "clamp(10px, 2vw, 25px) clamp(16px, 6vw, 48px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background circles */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-40px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontSize: "clamp(11px, 1.5vw, 13px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.75,
              marginBottom: "12px",
            }}
          >
            Your Personal Cinema
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 6vw, 56px)",
              fontWeight: "800",
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Track Your Favorite
            <br />
            Movies &amp; Series
          </h1>
          <p
            style={{
              marginTop: "16px",
              fontSize: "clamp(14px, 2vw, 18px)",
              opacity: 0.85,
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Organize, discover, and save everything you love all in one place.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(20px, 5vw, 48px)",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: `${data.length}+`, label: "Titles" },
              {
                value: `${data.filter((m) => m.type === "movie").length}`,
                label: "Movies",
              },
              {
                value: `${data.filter((m) => m.type === "series").length}`,
                label: "Series",
              },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(22px, 4vw, 32px)",
                    fontWeight: "800",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.7,
                    marginTop: "4px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section
        style={{ padding: "32px 24px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <h2
          ref={featuredRef}
          style={{
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "var(--text)",
          }}
        >
          Featured
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "20px",
          }}
        >
          {featured.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {allFeatured.length > ITEMS_PER_2_ROWS && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <button
              onClick={() => {
                if (showAllFeatured) {
                  setShowAllFeatured(false);
                  featuredRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
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
      <section
        style={{ padding: "0 24px 48px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <h2
          ref={trendingRef}
          style={{
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "var(--text)",
          }}
        >
          🔥 Trending
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "20px",
          }}
        >
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {allTrending.length > ITEMS_PER_2_ROWS && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <button
              onClick={() => {
                if (showAllTrending) {
                  setShowAllTrending(false);
                  trendingRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
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
