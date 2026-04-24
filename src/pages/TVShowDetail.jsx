import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

/* ── Missing components defined ───────────────────────────── */
function ErrorUI() {
  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", gap: "12px" }}>
        <p style={{ fontSize: "48px" }}>⚠️</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Failed to load show</p>
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
        <p style={{ fontSize: "48px" }}>📺</p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Show not found</p>
        <Link to="/listview" style={{ color: "var(--primary)", textDecoration: "underline" }}>← Back to Browse</Link>
      </div>
    </div>
  );
}

export default function TVShowDetail() {
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

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShow() {
      try {
        setLoading(true);
        const res = await import("../data/Data");
        const found = res.data.find((m) => m.id === parseInt(id));
        setShow(found ?? null);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchShow();
  }, [id]);

  useEffect(() => {
    if (!show) return;
    try {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = viewed.filter((item) => item.id !== show.id);
      const updated = [{ id: show.id, title: show.title, type: show.type, image: show.image }, ...filtered].slice(0, 5);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    } catch {}
  }, [show]);

  const handleAddToWatchlist = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    try {
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
      if (added) {
        localStorage.setItem("watchlist", JSON.stringify(watchlist.filter((item) => item.id !== show.id)));
        setAdded(false);
      } else {
        if (!watchlist.some((item) => item.id === show.id)) {
          watchlist.push({ id: show.id, title: show.title, type: show.type, image: show.image });
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
        localStorage.setItem("favorites", JSON.stringify(favorites.filter((item) => item.id !== show.id)));
        setAddedFav(false);
      } else {
        if (!favorites.some((item) => item.id === show.id)) {
          favorites.push({ id: show.id, title: show.title, type: show.type, image: show.image });
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
          <p>Loading show...</p>
        </div>
      </div>
    );
  }
  if (error) return <ErrorUI />;
  if (!show) return <NotFoundUI />;

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

      {showLoginPrompt && modalBackdrop(() => setShowLoginPrompt(false), (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "40px" }}>🎬</div>
          <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>You're not logged in!</h3>
          <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>Join us to track your watchlist, favorites, and more.</p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>Join Us!</button>
          </Link>
          <button onClick={() => setShowLoginPrompt(false)} style={{ backgroundColor: "transparent", color: "var(--text)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px", cursor: "pointer", width: "100%" }}>Maybe Later</button>
        </div>
      ))}

      {showModal && modalBackdrop(() => setShowModal(false), (
        <>
          <p style={{ fontSize: "36px", marginBottom: "8px" }}>✓</p>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Watchlist!</h3>
          <p style={{ opacity: 0.7, marginBottom: "20px" }}>{show.title} has been saved.</p>
          <button onClick={() => setShowModal(false)} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}>Continue Browsing</button>
        </>
      ))}

      {showFavModal && modalBackdrop(() => setShowFavModal(false), (
        <>
          <p style={{ fontSize: "36px", marginBottom: "8px" }}>★</p>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Favorites!</h3>
          <p style={{ opacity: 0.7, marginBottom: "20px" }}>{show.title} has been saved.</p>
          <button onClick={() => setShowFavModal(false)} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}>Continue Browsing</button>
        </>
      ))}

      {showTrailer && (
        <div onClick={() => setShowTrailer(false)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "800px", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
            <button onClick={() => setShowTrailer(false)} style={{ position: "absolute", top: "8px", right: "12px", background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", zIndex: 10, padding: 0 }}>✕</button>
            <iframe
              width="100%" height="450"
              src={show.trailer ? `${show.trailer}?autoplay=1` : ""}
              title={`${show.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 48px" }}>
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {/* Poster */}
          <div style={{ width: "100%", maxWidth: "280px", flexShrink: 0, margin: "0 auto" }}>
            <img
              src={show.image} alt={show.title}
              style={{ width: "100%", borderRadius: "12px", objectFit: "cover", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "800", margin: "0 0 12px" }}>{show.title}</h1>

            {show.genre && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {(Array.isArray(show.genre) ? show.genre : [show.genre]).map((g, i) => (
                  <span key={i} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>{g}</span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", opacity: 0.7, fontSize: "14px", marginBottom: "16px" }}>
              {show.releaseDate && <span>📅 {new Date(show.releaseDate).getFullYear()}</span>}
              {show.duration && <span>⏱ {show.duration} min / ep</span>}
              {show.studio && <span>🎬 {show.studio}</span>}
              {show.rating != null && <span style={{ color: "#FBBF24", fontWeight: "700", opacity: 1 }}>⭐ {show.rating}/10</span>}
            </div>

            <p style={{ lineHeight: "1.7", opacity: 0.85, marginBottom: "16px" }}>{show.description}</p>
            {show.director && <p style={{ marginBottom: "8px" }}><strong>Director: </strong><span style={{ opacity: 0.8 }}>{show.director}</span></p>}
            {show.cast && <p style={{ marginBottom: "16px" }}><strong>Cast: </strong><span style={{ opacity: 0.8 }}>{show.cast.join(", ")}</span></p>}

            {/* Seasons grid */}
            {show.seasons?.total && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Seasons &amp; Episodes</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                  {show.seasons.episodesPerSeason.map((eps, i) => (
                    <div key={i} style={{ backgroundColor: "var(--secondary)", borderRadius: "8px", padding: "8px 12px", textAlign: "center" }}>
                      <div style={{ fontWeight: "bold", fontSize: "13px" }}>Season {i + 1}</div>
                      <div style={{ opacity: 0.7, fontSize: "12px" }}>{eps} Episodes</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {show.trailer && (
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
  );
}