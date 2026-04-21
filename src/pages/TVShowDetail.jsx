import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function TVShowDetail() {
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

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShow() {
      try {
        setLoading(true);

        // TEMP: simulate backend
        const res = await import("../data/Data");
        const found = res.data.find((m) => m.id === parseInt(id));

        setShow(found);
      } catch (err) {
        setError("Failed to load show");
      } finally {
        setLoading(false);
      }
    }

    fetchShow();
  }, [id]);

  useEffect(() => {
    if (!show) return;
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = viewed.filter((item) => item.id !== show.id);
    const updated = [
      { id: show.id, title: show.title, type: show.type, image: show.image },
      ...filtered,
    ];
    const capped = updated.slice(0, 5);
    localStorage.setItem("recentlyViewed", JSON.stringify(capped));
  }, [show]);

  const handleAddToWatchlist = () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (added) {
      const updated = watchlist.filter((item) => item.id !== show.id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      setAdded(false);
    } else {
      if (!watchlist.some((item) => item.id === show.id)) {
        watchlist.push({
          id: show.id,
          title: show.title,
          type: show.type,
          image: show.image,
        });
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
      const updated = favorites.filter((item) => item.id !== show.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setAddedFav(false);
    } else {
      if (!favorites.some((item) => item.id === show.id)) {
        favorites.push({
          id: show.id,
          title: show.title,
          type: show.type,
          image: show.image,
        });
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
      setAddedFav(true);
      setShowFavModal(true);
    }
  };
  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <p>Loading show...</p>
        </div>
      </div>
    );
  }
  if (error) return <ErrorUI />;
  if (!show) return <NotFoundUI />;
  return (
    <div
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      className="min-h-screen"
    >
      <Navbar />

      {/* Not Logged In Popup */}
      {showLoginPrompt && (
        <div
          onClick={() => setShowLoginPrompt(false)}
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
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ fontSize: "40px" }}>🎬</div>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
              You're not logged in!
            </h3>
            <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>
              Join us to track your watchlist, favorites, and more.
            </p>
            <Link to="/Login" style={{ textDecoration: "none", width: "100%" }}>
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
          </div>
        </div>
      )}

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
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
          </div>
        </div>
      )}

      {showFavModal && (
        <div
          onClick={() => setShowFavModal(false)}
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
          </div>
        </div>
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
                width: "auto",
                marginTop: 0,
                padding: 0,
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

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img
              src={show.image}
              alt={show.title}
              className="rounded-lg w-full"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{show.title}</h1>

            {show.genre && (
              <div className="flex flex-wrap gap-2 mt-3">
                {(Array.isArray(show.genre) ? show.genre : [show.genre]).map(
                  (g, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                      }}
                    >
                      {g}
                    </span>
                  ),
                )}
              </div>
            )}

            <div
              className="flex flex-wrap gap-6 mt-4"
              style={{ opacity: 0.7, fontSize: "14px" }}
            >
              {show.releaseDate && (
                <span>📅 {new Date(show.releaseDate).getFullYear()}</span>
              )}
              {show.duration && <span>⏱ {show.duration} min / ep</span>}
              {show.studio && <span>🎬 {show.studio}</span>}
              {show.rating != null && (
                <span
                  style={{ color: "#FBBF24", fontWeight: "700", opacity: 1 }}
                >
                  ⭐ {show.rating}/10
                </span>
              )}
            </div>

            <p className="mt-4" style={{ lineHeight: "1.7", opacity: 0.85 }}>
              {show.description}
            </p>

            {show.director && (
              <div className="mt-4">
                <span className="font-bold">Director: </span>
                <span style={{ opacity: 0.8 }}>{show.director}</span>
              </div>
            )}

            {show.cast && (
              <div className="mt-4">
                <span className="font-bold">Cast: </span>
                <span style={{ opacity: 0.8 }}>{show.cast.join(", ")}</span>
              </div>
            )}

            {show.seasons && show.seasons.total && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-3">Seasons & Episodes</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                  }}
                >
                  {show.seasons.episodesPerSeason.map((eps, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: "var(--secondary)",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        textAlign: "center",
                      }}
                    >
                      <div className="font-bold" style={{ fontSize: "14px" }}>
                        Season {i + 1}
                      </div>
                      <div style={{ opacity: 0.7, fontSize: "12px" }}>
                        {eps} Episodes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
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
