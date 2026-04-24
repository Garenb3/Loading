import { useState, useMemo, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import Sidebar from "../components/Sidebar";

const ALL_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Drama", "Family", "Fantasy", "History", "Horror", "Mystery",
  "Political", "Romance", "Sci-Fi", "Thriller",
];

export default function ListView() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 800));
        const response = await import("../data/Data");
        setMovies(response.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = movies.filter((item) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inGenre = Array.isArray(item.genre)
          ? item.genre.some((g) => g.toLowerCase().includes(q))
          : item.genre?.toLowerCase().includes(q);
        const inDirector = item.director?.toLowerCase().includes(q);
        if (!inTitle && !inGenre && !inDirector) return false;
      }
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (selectedGenres.length > 0) {
        const itemGenres = Array.isArray(item.genre) ? item.genre : [item.genre];
        if (!selectedGenres.some((g) => itemGenres.includes(g))) return false;
      }
      return true;
    });

    if (sortBy === "rating-desc") result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortBy === "rating-asc") result = [...result].sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    else if (sortBy === "year-desc") result = [...result].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    else if (sortBy === "year-asc") result = [...result].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    else if (sortBy === "title-az") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [movies, search, typeFilter, selectedGenres, sortBy]);

  const activeFilterCount = (typeFilter !== "all" ? 1 : 0) + selectedGenres.length;

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <p>Loading Movies and TV Shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ textAlign: "center", padding: "100px", color: "red" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Sidebar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px 32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "24px" }}>
          Movies &amp; Series
        </h1>

        {/* Search + Sort + Filter row */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)", opacity: 0.4, fontSize: "16px", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, genres, directors…"
              style={{
                width: "100%", padding: "10px 36px 10px 38px",
                borderRadius: "8px", border: "1px solid rgba(128,128,128,0.3)",
                backgroundColor: "var(--secondary)", color: "var(--text)",
                fontSize: "14px", outline: "none", boxSizing: "border-box",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: "10px", top: "50%",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  cursor: "pointer", opacity: 0.5, color: "var(--text)", fontSize: "16px", padding: 0,
                }}
              >✕</button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid rgba(128,128,128,0.3)",
              backgroundColor: "var(--secondary)", color: "var(--text)",
              fontSize: "14px", cursor: "pointer", outline: "none",
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="rating-desc">Rating ↓</option>
            <option value="rating-asc">Rating ↑</option>
            <option value="year-desc">Newest First</option>
            <option value="year-asc">Oldest First</option>
            <option value="title-az">Title A–Z</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            style={{
              padding: "10px 18px", borderRadius: "8px",
              border: "1px solid rgba(128,128,128,0.3)",
              backgroundColor: showFilter ? "var(--primary)" : "var(--secondary)",
              color: showFilter ? "#fff" : "var(--text)",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              transition: "background-color 0.2s, color 0.2s",
            }}
          >
            🎛 Filter
            {activeFilterCount > 0 && (
              <span style={{
                backgroundColor: showFilter ? "#fff" : "var(--primary)",
                color: showFilter ? "var(--primary)" : "#fff",
                borderRadius: "999px", fontSize: "11px",
                padding: "1px 7px", fontWeight: "bold",
              }}>{activeFilterCount}</span>
            )}
            <span style={{
              display: "inline-block", transition: "transform 0.3s",
              transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
            }}>▼</span>
          </button>
        </div>

        {/* Filter panel */}
        <div style={{
          overflow: "hidden",
          maxHeight: showFilter ? "600px" : "0px",
          opacity: showFilter ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.25s ease",
        }}>
          <div style={{
            backgroundColor: "var(--secondary)", borderRadius: "12px",
            padding: "20px", marginBottom: "20px",
            border: "1px solid rgba(128,128,128,0.15)",
          }}>
            <p style={{ fontSize: "12px", fontWeight: "700", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px 0" }}>
              Type
            </p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[{ label: "All", value: "all" }, { label: "🎬 Movies", value: "movie" }, { label: "📺 Series", value: "series" }].map(({ label, value }) => (
                <button
                  type="button" key={value} onClick={() => setTypeFilter(value)}
                  style={{
                    padding: "7px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                    border: `2px solid ${typeFilter === value ? "var(--primary)" : "rgba(128,128,128,0.3)"}`,
                    backgroundColor: typeFilter === value ? "var(--primary)" : "transparent",
                    color: typeFilter === value ? "#fff" : "var(--text)", transition: "all 0.15s",
                  }}
                >{label}</button>
              ))}
            </div>
            <p style={{ fontSize: "12px", fontWeight: "700", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px 0" }}>
              Genre
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {ALL_GENRES.map((genre) => (
                <button
                  type="button" key={genre} onClick={() => toggleGenre(genre)}
                  style={{
                    padding: "5px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    border: `1px solid ${selectedGenres.includes(genre) ? "var(--primary)" : "rgba(128,128,128,0.3)"}`,
                    backgroundColor: selectedGenres.includes(genre) ? "var(--primary)" : "transparent",
                    color: selectedGenres.includes(genre) ? "#fff" : "var(--text)", transition: "all 0.15s",
                  }}
                >{genre}</button>
              ))}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setTypeFilter("all"); setSelectedGenres([]); }}
                style={{
                  padding: "7px 18px", borderRadius: "8px",
                  border: "1px solid rgba(128,128,128,0.3)",
                  backgroundColor: "transparent", color: "var(--text)",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: 0.7,
                }}
              >✕ Clear all filters</button>
            )}
          </div>
        </div>

        <p style={{ fontSize: "13px", opacity: 0.5, marginBottom: "20px" }}>
          {filtered.length} title{filtered.length !== 1 ? "s" : ""} found
        </p>

        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
            {filtered.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.6 }}>
            <p style={{ fontSize: "48px", marginBottom: "12px" }}>🎬</p>
            <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px" }}>No results found</p>
            <p style={{ fontSize: "14px" }}>Try a different search or adjust your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}