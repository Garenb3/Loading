import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/authService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

function resolveImage(image) {
  if (!image) return "https://via.placeholder.com/300x450?text=No+Image";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${BASE_URL}/images/${image}`;
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

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
          Failed to load show
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
        <p style={{ fontSize: "48px" }}>📺</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Show not found</p>
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

export default function TVShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = getStoredUser();
  const isGuest = !storedUser?.email;
  const userId = storedUser?._id;

  const [show, setShow] = useState(null);
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

  useEffect(() => {
    if (!id) return;
    async function fetchShow() {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`${API_BASE_URL}/media/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setShow(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchShow();
  }, [id]);

  useEffect(() => {
    if (isGuest || !userId || !show) return;
    async function syncUserState() {
      try {
        const userData = await authFetch(`/user/${userId}`);
        setAdded(
          userData.watchlist?.some(
            (item) => String(item) === String(show._id),
          ) ?? false,
        );
        setAddedFav(
          userData.favorites?.some(
            (item) => String(item) === String(show._id),
          ) ?? false,
        );
      } catch {
        /* Silently fail */
      }
    }
    syncUserState();
  }, [userId, show, isGuest]);

  useEffect(() => {
    if (!show || isGuest || !userId) return;
    async function trackRecentlyViewed() {
      try {
        await authFetch(`/user/${userId}/recentlyviewed`, "POST", {
          mediaId: String(show._id),
        });
      } catch {
        /* Silently fail */
      }
    }
    trackRecentlyViewed();
  }, [show, userId, isGuest]);

  const handleAddToWatchlist = async () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      if (added) {
        await authFetch(`/user/${userId}/watchlist/${show._id}`, "DELETE");
        setAdded(false);
      } else {
        await authFetch(`/user/${userId}/watchlist`, "POST", {
          mediaId: String(show._id),
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

  const handleAddToFavorites = async () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      if (addedFav) {
        await authFetch(`/user/${userId}/favorites/${show._id}`, "DELETE");
        setAddedFav(false);
      } else {
        await authFetch(`/user/${userId}/favorites`, "POST", {
          mediaId: String(show._id),
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

  if (loading)
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
          <p>Loading show...</p>
        </div>
      </div>
    );
  if (error) return <ErrorUI />;
  if (!show) return <NotFoundUI />;

  // ── Pull out seasons data from the nested schema ──────────
  const seasonsTotal = show.seasons?.total ?? 0;
  const episodesPerSeason = Array.isArray(show.seasons?.episodesPerSeason)
    ? show.seasons.episodesPerSeason
    : [];
  const totalEpisodes = episodesPerSeason.reduce(
    (sum, n) => sum + (Number(n) || 0),
    0,
  );

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

      {showLoginPrompt &&
        modalBackdrop(
          () => setShowLoginPrompt(false),
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div style={{ fontSize: "40px" }}>📺</div>
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
              {show.title} has been saved.
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
              {show.title} has been saved.
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
              src={show.trailer ? `${show.trailer}?autoplay=1` : ""}
              title={`${show.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "clamp(16px,4vw,48px) clamp(16px,4vw,32px)",
        }}
      >
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

        <div
          style={{
            display: "flex",
            gap: "clamp(20px,4vw,48px)",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Poster */}
          <div
            style={{
              width: "clamp(160px,30%,280px)",
              flexShrink: 0,
              margin: "0 auto",
              alignSelf: "center",
            }}
          >
            <img
              src={resolveImage(show.image)}
              alt={show.title}
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

          {/* Info */}
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1
              style={{
                fontSize: "clamp(20px,4vw,34px)",
                fontWeight: "800",
                margin: "0 0 12px",
                lineHeight: 1.2,
              }}
            >
              {show.title}
            </h1>

            <span
              style={{
                display: "inline-block",
                marginBottom: "12px",
                backgroundColor: "var(--primary)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "700",
                padding: "3px 12px",
                borderRadius: "999px",
              }}
            >
              📺 Series
            </span>

            {show.genre && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {(Array.isArray(show.genre) ? show.genre : [show.genre]).map(
                  (g, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "var(--text)",
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
              {show.releaseDate && (
                <span>📅 {new Date(show.releaseDate).getFullYear()}</span>
              )}
              {seasonsTotal > 0 && (
                <span>
                  📺 {seasonsTotal} Season{seasonsTotal > 1 ? "s" : ""}
                </span>
              )}
              {totalEpisodes > 0 && (
                <span>🎞 {totalEpisodes} Total Episodes</span>
              )}
              {show.duration > 0 && <span>⏱ {show.duration} min/ep</span>}
              {show.studio && <span>🏢 {show.studio}</span>}
              {show.rating != null && (
                <span
                  style={{ color: "#FBBF24", fontWeight: "700", opacity: 1 }}
                >
                  ⭐ {show.rating}/10
                </span>
              )}
            </div>

            <p
              style={{
                lineHeight: "1.75",
                opacity: 0.85,
                marginBottom: "16px",
                fontSize: "clamp(13px,1.5vw,15px)",
              }}
            >
              {show.description}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {show.director && (
                <p style={{ margin: 0 }}>
                  <strong>Director: </strong>
                  <span style={{ opacity: 0.8 }}>{show.director}</span>
                </p>
              )}
              {show.cast?.length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>Cast: </strong>
                  <span style={{ opacity: 0.8 }}>
                    {Array.isArray(show.cast)
                      ? show.cast.join(", ")
                      : show.cast}
                  </span>
                </p>
              )}
            </div>

            {/* ── Per-season breakdown grid ── */}
            {seasonsTotal > 0 && episodesPerSeason.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    opacity: 0.5,
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Season Breakdown
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: "8px",
                  }}
                >
                  {episodesPerSeason.map((eps, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontWeight: "800", fontSize: "18px" }}>
                        {Number(eps) || "—"}
                      </div>
                      <div
                        style={{
                          opacity: 0.55,
                          fontSize: "11px",
                          marginTop: "2px",
                        }}
                      >
                        S{i + 1} Episodes
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary row */}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "16px",
                    fontSize: "13px",
                    opacity: 0.65,
                  }}
                >
                  <span>
                    {seasonsTotal} season{seasonsTotal > 1 ? "s" : ""}
                  </span>
                  <span>·</span>
                  <span>{totalEpisodes} total episodes</span>
                </div>
              </div>
            )}

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

            {show.trailer && (
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
