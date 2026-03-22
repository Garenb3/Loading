import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { data } from "../data/Data";

export default function TVShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [added, setAdded] = useState(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    return watchlist.some(item => item.id === parseInt(id));
  });
  const [showModal, setShowModal] = useState(false);

  const [addedFav, setAddedFav] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.some(item => item.id === parseInt(id));
  });
  const [showFavModal, setShowFavModal] = useState(false);

  const show = data.find(s => s.id === parseInt(id));

  useEffect(() => {
    if (!show) return;
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = viewed.filter(item => item.id !== show.id);
    const updated = [{ id: show.id, title: show.title, type: show.type, image: show.image }, ...filtered];
    const capped = updated.slice(0, 5);
    localStorage.setItem("recentlyViewed", JSON.stringify(capped));
  }, [show]);

  if (!show) return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-xl">Show not found.</p>
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
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (added) {
      const updated = watchlist.filter(item => item.id !== show.id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      setAdded(false);
    } else {
      if (!watchlist.some(item => item.id === show.id)) {
        watchlist.push({ id: show.id, title: show.title, type: show.type, image: show.image });
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
      }
      setAdded(true);
      setShowModal(true);
    }
  };

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (addedFav) {
      const updated = favorites.filter(item => item.id !== show.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setAddedFav(false);
    } else {
      if (!favorites.some(item => item.id === show.id)) {
        favorites.push({ id: show.id, title: show.title, type: show.type, image: show.image });
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
      setAddedFav(true);
      setShowFavModal(true);
    }
  };

  const renderStars = (rating) => {
    const filled = Math.round((rating / 10) * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < filled ? "#e50914" : "var(--text)", opacity: i < filled ? 1 : 0.3, fontSize: "18px" }}>★</span>
    ));
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />

      {/* Watchlist Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "32px", maxWidth: "360px", width: "90%", textAlign: "center" }}
          >
            <p style={{ fontSize: "36px", marginBottom: "8px" }}>✓</p>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Watchlist!</h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>{show.title} has been saved.</p>
            <button
              onClick={() => setShowModal(false)}
              style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavModal && (
        <div
          onClick={() => setShowFavModal(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "32px", maxWidth: "360px", width: "90%", textAlign: "center" }}
          >
            <p style={{ fontSize: "36px", marginBottom: "8px" }}>★</p>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Added to Favorites!</h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>{show.title} has been saved.</p>
            <button
              onClick={() => setShowFavModal(false)}
              style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={show.image}
              alt={show.title}
              className="rounded-lg w-full"
              style={{ objectFit: "cover", maxHeight: "450px" }}
              onError={e => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{show.title}</h1>

            {show.genre && (
              <div className="flex flex-wrap gap-2 mt-3">
                {(Array.isArray(show.genre) ? show.genre : [show.genre]).map((g, i) => (
                  <span key={i} style={{ backgroundColor: "var(--primary)", color: "#fff", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            {show.rating && (
              <div className="mt-4 flex items-center gap-2">
                <div>{renderStars(show.rating)}</div>
                <span style={{ opacity: 0.7, fontSize: "14px" }}>{show.rating}/10</span>
              </div>
            )}

            {show.releaseDate && (
              <p className="mt-2" style={{ opacity: 0.6, fontSize: "14px" }}>
                Released: {new Date(show.releaseDate).getFullYear()}
              </p>
            )}

            {show.studio && (
              <p className="mt-1" style={{ opacity: 0.6, fontSize: "14px" }}>
                Studio: {show.studio}
              </p>
            )}

            <p className="mt-4" style={{ lineHeight: "1.7", opacity: 0.85 }}>{show.description}</p>

            {show.cast && (
              <div className="mt-4">
                <span className="font-bold">Cast: </span>
                <span style={{ opacity: 0.8 }}>{show.cast.join(", ")}</span>
              </div>
            )}

            {show.seasons && Array.isArray(show.seasons) && show.seasons.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-3">Seasons & Episodes</h2>
                <div className="flex flex-col gap-2">
                  {show.seasons.map((s, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: "var(--secondary)", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span className="font-bold">Season {s.season}</span>
                      <span style={{ opacity: 0.7, fontSize: "14px" }}>{s.episodes} Episodes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToWatchlist}
                className="px-6 py-3 rounded font-bold"
                style={{
                  backgroundColor: added ? "#4caf50" : "var(--primary)",
                  color: "#fff", border: "none",
                  cursor: "pointer",
                  fontSize: "15px", transition: "background-color 0.3s"
                }}
              >
                {added ? "✓ In Watchlist — Remove" : "+ Add to Watchlist"}
              </button>

              <button
                onClick={handleAddToFavorites}
                className="px-6 py-3 rounded font-bold"
                style={{
                  backgroundColor: addedFav ? "#e59400" : "var(--secondary)",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: "15px", transition: "background-color 0.3s"
                }}
              >
                {addedFav ? "★ In Favorites — Remove" : "☆ Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}