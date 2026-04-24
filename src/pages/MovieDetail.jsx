import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

/* ── Missing components that were referenced but never defined ── */
function ErrorUI() {
  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", gap: "12px" }}>
        <p style={{ fontSize: "48px" }}>⚠️</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Failed to load movie</p>
        <Link to="/listview" style={{ color: "var(--primary)", textDecoration: "underline" }}>← Back to Browse</Link>
      </div>
    </div>
  );
}

function NotFoundUI() {
  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", gap: "12px" }}>
        <p style={{ fontSize: "48px" }}>🎬</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Movie not found</p>
        <Link to="/listview" style={{ color: "var(--primary)", textDecoration: "underline" }}>← Back to Browse</Link>
      </div>
    </div>
  );
}

export default function MovieDetail() {
  const { id } = useParams();

  const isGuest = !(() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })().email;

  const [added, setAdded] = useState(() => {
    try { return JSON.parse(localStorage.getItem("watchlist") || "[]").some((item) => item.id === parseInt(id)); }
    catch { return false; }
  });
  const [showModal, setShowModal] = useState(false);
  const [addedFav, setAddedFav] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]").some((item) => item.id === parseInt(id)); }
    catch { return false; }
  });
  const [showFavModal, setShowFavModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const res = await import("../data/Data");
        const found = res.data.find((m) => m.id === parseInt(id));
        setMovie(found ?? null);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    try {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = viewed.filter((item) => item.id !== movie.id);
      const updated = [{ id: movie.id, title: movie.title, type: movie.type, image: movie.image }, ...filtered].slice(0, 5);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    } catch {}
  }, [movie]);

  const handleAddToWatchlist = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    try {
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
      if (added) {
        localStorage.setItem("watchlist", JSON.stringify(watchlist.filter((item) => item.id !== movie.id)));
        setAdded(false);
      } else {
        if (!watchlist.some((item) => item.id === movie.id)) {
          watchlist.push({ id: movie.id, title: movie.title, type: movie.type, image: movie.image });
          localStorage.setItem("watchlist", JSON.stringify(watchlist));
        }
        setAdded(true);
        setShowModal(true);
      }
    } catch {}
  };

  const handleAddToFavorites = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (addedFav) {
        localStorage.setItem("favorites", JSON.stringify(favorites.filter((item) => item.id !== movie.id)));
        setAddedFav(false);
      } else {
        if (!favorites.some((item) => item.id === movie.id)) {
          favorites.push({ id: movie.id, title: movie.title, type: movie.type, image: movie.image });
          localStorage.setItem("favorites", JSON.stringify(favorites));
        }
        setAddedFav(true);
        setShowFavModal(true);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }
  if (error) return <ErrorUI />;
  if (!movie) return <NotFoundUI />;

  /* ── Shared modal backdrop ─────────────────────────────────── */
  const modalBackdrop = (onClose, children) => (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: "var(--secondary)", borderRadius: "12px",
        padding: "32px", maxWidth: "360px", width: "90%", textAlign: "center",
      }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />

      {/* Login prompt */}
      {showLoginPrompt && modalBackdrop(() => setShowLoginPrompt(false), (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "40px" }}>🎬</div>
          <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>You're not logged in!</h3>
          <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>Join us to track your watchlist, favorites, and more.</p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
              Join Us!
            </button>
          </Link>
          <button onClick={() => setShowLoginPrompt(false)} style={{ backgroundColor: "transparent", color: "var(--text)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px", cursor: "pointer", width: "100%" }}>
            Maybe Later
          </button>
        </div>
      ))}

      {/* Watchlist modal */}
      {showModal && modalBackdrop(() => setShowModal(false), (
        <>
          <p style={{ fontSize: "36px", marginBottom: "8px" }}>✓</p>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Watchlist!</h3>
          <p style={{ opacity: 0.7, marginBottom: "20px" }}>{movie.title} has been saved.</p>
          <button onClick={() => setShowModal(false)} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}>
            Continue Browsing
          </button>
        </>
      ))}

      {/* Favorites modal */}
      {showFavModal && modalBackdrop(() => setShowFavModal(false), (
        <>
          <p style={{ fontSize: "36px", marginBottom: "8px" }}>★</p>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Favorites!</h3>
          <p style={{ opacity: 0.7, marginBottom: "20px" }}>{movie.title} has been saved.</p>
          <button onClick={() => setShowFavModal(false)} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}>
            Continue Browsing
          </button>
        </>
      ))}

      {/* Trailer modal */}
      {showTrailer && (
        <div onClick={() => setShowTrailer(false)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "800px", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
            <button onClick={() => setShowTrailer(false)} style={{
              position: "absolute", top: "8px", right: "12px", background: "none",
              border: "none", color: "white", fontSize: "24px", cursor: "pointer", zIndex: 10, padding: 0,
            }}>✕</button>
            <iframe
              width="100%" height="450"
              src={movie.trailer ? `${movie.trailer}?autoplay=1` : ""}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {/* Poster */}
            <div style={{ width: "100%", maxWidth: "280px", flexShrink: 0, margin: "0 auto" }}>
              <img
                src={movie.image} alt={movie.title}
                style={{ width: "100%", borderRadius: "12px", objectFit: "cover", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: "240px" }}>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "800", margin: "0 0 12px" }}>{movie.title}</h1>

              {movie.genre && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((g, i) => (
                    <span key={i} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>{g}</span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", opacity: 0.7, fontSize: "14px", marginBottom: "16px" }}>
                {movie.releaseDate && <span>📅 {new Date(movie.releaseDate).getFullYear()}</span>}
                {movie.duration && <span>⏱ {movie.duration} min</span>}
                {movie.studio && <span>🎬 {movie.studio}</span>}
                {movie.rating != null && <span style={{ color: "#FBBF24", fontWeight: "700", opacity: 1 }}>⭐ {movie.rating}/10</span>}
              </div>

              <p style={{ lineHeight: "1.7", opacity: 0.85, marginBottom: "16px" }}>{movie.description}</p>
              {movie.director && <p style={{ marginBottom: "8px" }}><strong>Director: </strong><span style={{ opacity: 0.8 }}>{movie.director}</span></p>}
              {movie.cast && <p style={{ marginBottom: "24px" }}><strong>Cast: </strong><span style={{ opacity: 0.8 }}>{movie.cast.join(", ")}</span></p>}

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={handleAddToWatchlist} style={{
                  flex: 1, minWidth: "160px",
                  backgroundColor: added ? "#4caf50" : "var(--primary)", color: "#fff",
                  border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "bold",
                  padding: "12px 20px", borderRadius: "8px", transition: "background-color 0.3s", whiteSpace: "nowrap",
                }}>
                  {added ? "✓ In Watchlist — Remove" : "+ Add to Watchlist"}
                </button>
                <button onClick={handleAddToFavorites} style={{
                  flex: 1, minWidth: "160px",
                  backgroundColor: addedFav ? "#e59400" : "var(--primary)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: "14px", fontWeight: "bold",
                  padding: "12px 20px", borderRadius: "8px", transition: "background-color 0.3s", whiteSpace: "nowrap",
                }}>
                  {addedFav ? "★ In Favorites — Remove" : "☆ Add to Favorites"}
                </button>
              </div>

              {movie.trailer && (
                <button onClick={() => setShowTrailer(true)} style={{
                  display: "block", width: "100%", marginTop: "12px",
                  backgroundColor: "#1a1a1a", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
                  fontSize: "14px", fontWeight: "bold", padding: "12px 20px", borderRadius: "8px",
                }}>▶ Watch Trailer</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}