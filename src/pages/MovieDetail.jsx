import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/authService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// ── Error / Not Found UI ──────────────────────────────────────
function ErrorUI() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "48px" }}>⚠️</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          Failed to load movie
        </p>
        <Link
          to="/listview"
          style={{ color: "var(--primary)", textDecoration: "underline" }}
        >
          ← Back to Browse
        </Link>
      </div>
    </div>
  );
}

function NotFoundUI() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "48px" }}>🎬</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Movie not found</p>
        <Link
          to="/listview"
          style={{ color: "var(--primary)", textDecoration: "underline" }}
        >
          ← Back to Browse
        </Link>
      </div>
    </div>
  );
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = getStoredUser();
  const isGuest = !storedUser?.email;
  const userId = storedUser?._id;

  // ── State ─────────────────────────────────────────────────
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [added, setAdded] = useState(false);
  const [addedFav, setAddedFav] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ── Fetch movie from API by numeric id ───────────────────
  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/media`);
        if (!response.ok) throw new Error("Failed to fetch");
        const allMedia = await response.json();
        const found = allMedia.find((m) => String(m.id) === String(id));
        setMovie(found ?? null);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  // ── Sync watchlist/favorites state from backend ───────────
  useEffect(() => {
    if (isGuest || !userId || !movie) return;
    async function syncUserState() {
      try {
        const userData = await authFetch(`/user/${userId}`);
        setAdded(
          userData.watchlist?.some(
            (item) => String(item) === String(movie.id),
          ) ?? false,
        );
        setAddedFav(
          userData.favorites?.some(
            (item) => String(item) === String(movie.id),
          ) ?? false,
        );
      } catch {
        // Silently fail
      }
    }
    syncUserState();
  }, [userId, movie, isGuest]);

  // ── Track recently viewed ─────────────────────────────────
  useEffect(() => {
    if (!movie || isGuest || !userId) return;
    async function trackRecentlyViewed() {
      try {
        await authFetch(`/user/${userId}/recentlyviewed`, "POST", {
          mediaId: String(movie.id),
        });
      } catch {
        // Silently fail
      }
    }
    trackRecentlyViewed();
  }, [movie, userId, isGuest]);

  // ── Watchlist handler ─────────────────────────────────────
  const handleAddToWatchlist = async () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      if (added) {
        await authFetch(`/user/${userId}/watchlist/${movie.id}`, "DELETE");
        setAdded(false);
      } else {
        await authFetch(`/user/${userId}/watchlist`, "POST", {
          mediaId: String(movie.id),
        });
        setAdded(true);
        setShowModal(true);
      }
    } catch (err) {
      setActionError(err.message || "Failed to update watchlist");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Favorites handler ─────────────────────────────────────
  const handleAddToFavorites = async () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      if (addedFav) {
        await authFetch(`/user/${userId}/favorites/${movie.id}`, "DELETE");
        setAddedFav(false);
      } else {
        await authFetch(`/user/${userId}/favorites`, "POST", {
          mediaId: String(movie.id),
        });
        setAddedFav(true);
        setShowFavModal(true);
      }
    } catch (err) {
      setActionError(err.message || "Failed to update favorites");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading / Error states ────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          minHeight: "100vh",
        }}
      >
        <Sidebar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }
  if (error) return <ErrorUI />;
  if (!movie) return <NotFoundUI />;

  // ── Shared modal backdrop ─────────────────────────────────
  const modalBackdrop = (onClose, children) => (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--secondary)",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "360px",
          width: "90%",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      {/* Login prompt */}
      {showLoginPrompt &&
        modalBackdrop(
          () => setShowLoginPrompt(false),
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div style={{ fontSize: "40px" }}>🎬</div>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
              You're not logged in!
            </h3>
            <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>
              Join us to track your watchlist, favorites, and more.
            </p>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                Join Us!
              </button>
            </Link>
            <button
              onClick={() => setShowLoginPrompt(false)}
              style={{
                backgroundColor: "transparent",
                color: "var(--text)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "10px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Maybe Later
            </button>
          </div>,
        )}

      {/* Watchlist modal */}
      {showModal &&
        modalBackdrop(
          () => setShowModal(false),
          <>
            <p style={{ fontSize: "36px", marginBottom: "8px" }}>✓</p>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Added to Watchlist!
            </h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>
              {movie.title} has been saved.
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Continue Browsing
            </button>
          </>,
        )}

      {/* Favorites modal */}
      {showFavModal &&
        modalBackdrop(
          () => setShowFavModal(false),
          <>
            <p style={{ fontSize: "36px", marginBottom: "8px" }}>★</p>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Added to Favorites!
            </h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>
              {movie.title} has been saved.
            </p>
            <button
              onClick={() => setShowFavModal(false)}
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Continue Browsing
            </button>
          </>,
        )}

      {/* Trailer modal */}
      {showTrailer && (
        <div
          onClick={() => setShowTrailer(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "800px",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: "absolute",
                top: "8px",
                right: "12px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 10,
                padding: 0,
                width: "auto",
              }}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="450"
              src={movie.trailer ? `${movie.trailer}?autoplay=1` : ""}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 48px) clamp(16px, 4vw, 32px)",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "28px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            color: "var(--text)",
            fontSize: "14px",
            fontWeight: "600",
            padding: "8px 16px",
            cursor: "pointer",
            width: "auto",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.13)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
        >
          ← Back
        </button>

        {/* Action error banner */}
        {actionError && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,77,79,0.15)",
              border: "1px solid rgba(255,77,79,0.4)",
              color: "#ff4d4f",
              fontSize: "14px",
            }}
          >
            ⚠️ {actionError}
          </div>
        )}

        {/* Main layout */}
        <div
          style={{
            display: "flex",
            gap: "clamp(20px, 4vw, 48px)",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Poster */}
          <div
            style={{
              width: "clamp(160px, 30%, 280px)",
              flexShrink: 0,
              margin: "0 auto",
              alignSelf: "center",
            }}
          >
            <img
              src={`${BASE_URL}/images/${movie.image}`}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: "12px",
                objectFit: "cover",
                display: "block",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
          </div>

          {/* Info panel */}
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1
              style={{
                fontSize: "clamp(20px, 4vw, 34px)",
                fontWeight: "800",
                margin: "0 0 12px",
                lineHeight: 1.2,
              }}
            >
              {movie.title}
            </h1>

            {/* Genres */}
            {movie.genre && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map(
                  (g, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        padding: "3px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {g}
                    </span>
                  ),
                )}
              </div>
            )}

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                fontSize: "14px",
                marginBottom: "16px",
                opacity: 0.75,
              }}
            >
              {movie.releaseDate && <span>📅 {movie.releaseDate}</span>}
              {movie.duration && <span>⏱ {movie.duration} min</span>}
              {movie.studio && <span>🎬 {movie.studio}</span>}
              {movie.rating != null && (
                <span
                  style={{ color: "#FBBF24", fontWeight: "700", opacity: 1 }}
                >
                  ⭐ {movie.rating}/10
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                lineHeight: "1.75",
                opacity: 0.85,
                marginBottom: "16px",
                fontSize: "clamp(13px, 1.5vw, 15px)",
              }}
            >
              {movie.description}
            </p>

            {/* Crew */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {movie.director && (
                <p style={{ margin: 0 }}>
                  <strong>Director: </strong>
                  <span style={{ opacity: 0.8 }}>{movie.director}</span>
                </p>
              )}
              {movie.writer && (
                <p style={{ margin: 0 }}>
                  <strong>Writer: </strong>
                  <span style={{ opacity: 0.8 }}>{movie.writer}</span>
                </p>
              )}
              {movie.producer && (
                <p style={{ margin: 0 }}>
                  <strong>Producer: </strong>
                  <span style={{ opacity: 0.8 }}>{movie.producer}</span>
                </p>
              )}
              {movie.cast && (
                <p style={{ margin: 0 }}>
                  <strong>Cast: </strong>
                  <span style={{ opacity: 0.8 }}>{movie.cast.join(", ")}</span>
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleAddToWatchlist}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  minWidth: "150px",
                  backgroundColor: added ? "#4caf50" : "var(--primary)",
                  color: "#fff",
                  border: "none",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "background-color 0.3s",
                  whiteSpace: "nowrap",
                  opacity: actionLoading ? 0.7 : 1,
                }}
              >
                {actionLoading
                  ? "Saving..."
                  : added
                    ? "✓ In Watchlist — Remove"
                    : "+ Add to Watchlist"}
              </button>
              <button
                onClick={handleAddToFavorites}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  minWidth: "150px",
                  backgroundColor: addedFav ? "#e59400" : "var(--primary)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "background-color 0.3s",
                  whiteSpace: "nowrap",
                  opacity: actionLoading ? 0.7 : 1,
                }}
              >
                {actionLoading
                  ? "Saving..."
                  : addedFav
                    ? "★ In Favorites — Remove"
                    : "☆ Add to Favorites"}
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
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "12px 20px",
                  borderRadius: "8px",
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
