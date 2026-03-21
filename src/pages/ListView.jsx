import { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import { data } from "../data/Data";
import "../utils/ListView.css";

const ALL_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Drama", "Family", "Fantasy", "History", "Horror",
  "Mystery", "Political", "Romance", "Sci-Fi", "Thriller", ,
];

export default function ListView() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);

  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") setActiveSearch(searchInput);
  }

  function handleSearch() {
    setActiveSearch(searchInput);
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (activeSearch.trim()) {
        const queryWords = activeSearch.trim().toLowerCase().split(/\s+/);
        const title = item.title.toLowerCase();
        const matches = queryWords.every((qw) => title.includes(qw));
        if (!matches) return false;
      }
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (selectedGenres.length > 0) {
        const itemGenres = Array.isArray(item.genre) ? item.genre : [item.genre];
        const hasGenre = selectedGenres.some((g) => itemGenres.includes(g));
        if (!hasGenre) return false;
      }
      return true;
    });
  }, [activeSearch, typeFilter, selectedGenres]);

  return (
    <div className="lv-page">
      <Navbar />

      <div className="lv-container">
        <h1 className="lv-title">Movies &amp; Series</h1>

        <div className="lv-search-row">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search titles..."
            aria-label="Search movies and series"
            className="lv-search-input"
          />
          <button onClick={handleSearch} className="lv-btn-search">
            Search
          </button>
          <button onClick={() => setShowFilter((prev) => !prev)} className="lv-btn-filter">
            Filter {showFilter ? "▲" : "▼"}
          </button>

          {showFilter && (
            <div className="lv-filter-panel">

              <p className="lv-filter-label">Type</p>
              <div className="lv-type-row">
                {[
                  { label: "All", value: "all" },
                  { label: "Movies", value: "movie" },
                  { label: "Series", value: "series" },
                ].map(({ label, value }) => (
                  <label key={value} className="lv-option">
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={typeFilter === value}
                      onChange={() => setTypeFilter(value)}
                      className="lv-radio"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <p className="lv-filter-label">Genre</p>
              <div className="lv-genre-grid">
                {ALL_GENRES.map((genre) => (
                  <label key={genre} className="lv-option">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                      className="lv-checkbox"
                    />
                    {genre}
                  </label>
                ))}
              </div>

              <button
                onClick={() => { setTypeFilter("all"); setSelectedGenres([]); }}
                className="lv-btn-clear"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <p className="lv-count">{filtered.length} title{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div className="lv-empty">
            <p className="lv-empty-icon">🎬</p>
            <p className="lv-empty-text">No results found</p>
            <p className="lv-empty-sub">Try a different search or adjust your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
