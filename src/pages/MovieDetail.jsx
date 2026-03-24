import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { data } from "../data/Data";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isGuest = !JSON.parse(localStorage.getItem("user") || "{}").email;

  const [added, setAdded] = useState(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    return watchlist.some((item) => item.id === parseInt(id));
  });
  const [showModal, setShowModal] = useState(false);

  const [addedFav, setAddedFav] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.some((item) => item.id === parseInt(id));
  });
  const [showFavModal, setShowFavModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const movie = data.find((m) => m.id === parseInt(id));

  useEffect(() => {
    if (!movie) return;
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = viewed.filter((item) => item.id !== movie.id);
    const updated = [
      { id: movie.id, title: movie.title, type: movie.type, image: movie.image },
      ...filtered,
    ];
    const capped = updated.slice(0, 5);
    localStorage.setItem("recentlyViewed", JSON.stringify(capped));
  }, [movie]);

  if (!movie)
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl">Movie not found.</p>
          <button
            onClick={() => navigate(-1)}
            style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const handleAddToWatchlist = () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (added) {
      const updated = watchlist.filter((item) => item.id !== movie.id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      setAdded(false);
    } else {
      if (!watchlist.some((item) => item.id === movie.id)) {
        watchlist.push({ id: movie.id, title: movie.title, type: movie.type, image: movie.image });
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
      }
      setAdded(true);
      setShowModal(true);
    }
  };

  const handleAddToFavorites = () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (addedFav) {
      const updated = favorites.filter((item) => item.id !== movie.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setAddedFav(false);
    } else {
      if (!favorites.some((item) => item.id === movie.id)) {
        favorites.push({ id: movie.id, title: movie.title, type: movie.type, image: movie.image });
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
      setAddedFav(true);
      setShowFavModal(true);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />

      {/* Not Logged In Popup */}
      {showLoginPrompt && (
        <div onClick={() => setShowLoginPrompt(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "32px", maxWidth: "360px", width: "90%", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "40px" }}>🎬</div>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>You're not logged in!</h3>
            <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>Join us to track your watchlist, favorites, and more.</p>
            <Link to="/Login" style={{ textDecoration: "none", width: "100%" }}>
              <button style={{ backgroundColor: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
                Join Us!
              </button>
            </Link>
            <button
              onClick={() => setShowLoginPrompt(false)}
              style={{ backgroundColor: "transparent", color: "var(--text)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px", cursor: "pointer", width: "100%" }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Watchlist Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "32px", maxWidth: "360px", width: "90%", textAlign: "center" }}>
            <p style={{ fontSize: "36px", marginBottom: "8px" }}>✓</p>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Watchlist!</h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>{movie.title} has been saved.</p>
            <button onClick={() => setShowModal(false)} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}>
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavModal && (
        <div onClick={() => setShowFavModal(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "32px", maxWidth: "360px", width: "90%", textAlign: "center" }}>
            <p style={{ fontSize: "36px", marginBottom: "8px" }}>★</p>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Favorites!</h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>{movie.title} has been saved.</p>
            <button onClick={() => setShowFavModal(false)} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}>
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div onClick={() => setShowTrailer(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "800px", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
            <button onClick={() => setShowTrailer(false)} style={{ position: "absolute", top: "8px", right: "12px", background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", zIndex: 10, width: "auto", marginTop: 0, padding: 0 }}>
              ✕
            </button>
            <iframe
              width="100%"
              height="450"
              src={`${movie.trailer}?autoplay=1`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img
              src={movie.image}
              alt={movie.title}
              className="rounded-lg w-full"
              style={{ objectFit: "cover" }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{movie.title}</h1>

            {movie.genre && (
              <div className="flex flex-wrap gap-2 mt-3">
                {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((g, i) => (
                  <span key={i} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-6 mt-4" style={{ opacity: 0.7, fontSize: "14px" }}>
              {movie.releaseDate && <span>📅 {new Date(movie.releaseDate).getFullYear()}</span>}
              {movie.duration && <span>⏱ {movie.duration} min</span>}
              {movie.studio && <span>🎬 {movie.studio}</span>}
              {movie.rating != null && (
                <span style={{ color: "#FBBF24", fontWeight: "700", opacity: 1 }}>⭐ {movie.rating}/10</span>
              )}
            </div>

            <p className="mt-4" style={{ lineHeight: "1.7", opacity: 0.85 }}>{movie.description}</p>

            {movie.director && (
              <div className="mt-4">
                <span className="font-bold">Director: </span>
                <span style={{ opacity: 0.8 }}>{movie.director}</span>
              </div>
            )}

            {movie.cast && (
              <div className="mt-3">
                <span className="font-bold">Cast: </span>
                <span style={{ opacity: 0.8 }}>{movie.cast.join(", ")}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "row", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
              <button
                onClick={handleAddToWatchlist}
                style={{
                  flex: 1,
                  backgroundColor: added ? "#4caf50" : "var(--primary)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  transition: "background-color 0.3s",
                  whiteSpace: "nowrap",
                }}
              >
                {added ? "✓ In Watchlist — Remove" : "+ Add to Watchlist"}
              </button>

              <button
                onClick={handleAddToFavorites}
                style={{
                  flex: 1,
                  backgroundColor: addedFav ? "#e59400" : "var(--primary)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  transition: "background-color 0.3s",
                  whiteSpace: "nowrap",
                }}
              >
                {addedFav ? "★ In Favorites — Remove" : "☆ Add to Favorites"}
              </button>
            </div>

            {movie.trailer && (
              <button
                onClick={() => setShowTrailer(true)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "12px",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  borderRadius: "6px",
                }}
              >
                ▶ Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}