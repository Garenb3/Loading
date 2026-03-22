import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { data } from "../data/Data";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const movie = data.find((m) => m.id === parseInt(id));

  if (!movie)
    return (
      <div
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
        className="min-h-screen"
      >
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl">Movie not found.</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "var(--primary)",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const handleAddToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (!watchlist.some((item) => item.id === movie.id)) {
      watchlist.push({
        id: movie.id,
        title: movie.title,
        type: movie.type,
        image: movie.image,
      });
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
    setAdded(true);
    setShowModal(true);
  };

  return (
    <div
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      className="min-h-screen"
    >
      <Navbar />

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
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={movie.image}
              alt={movie.title}
              className="rounded-lg w-full"
              style={{ objectFit: "cover", maxHeight: "450px" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{movie.title}</h1>

            {movie.genre && (
              <div className="flex flex-wrap gap-2 mt-3">
                {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map(
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
              {movie.releaseDate && (
                <span>📅 {new Date(movie.releaseDate).getFullYear()}</span>
              )}
              {movie.duration && <span>⏱ {movie.duration} min</span>}
              {movie.studio && <span>🎬 {movie.studio}</span>}
            </div>

            <p className="mt-4" style={{ lineHeight: "1.7", opacity: 0.85 }}>
              {movie.description}
            </p>

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

            <button
              onClick={handleAddToWatchlist}
              disabled={added}
              className="mt-6 px-6 py-3 rounded font-bold"
              style={{
                backgroundColor: added ? "#4caf50" : "var(--primary)",
                color: "#fff",
                border: "none",
                cursor: added ? "default" : "pointer",
                fontSize: "15px",
                transition: "background-color 0.3s",
              }}
            >
              {added ? "✓ Added to Watchlist" : "+ Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
