import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const path = movie.type === "series" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <Link to={path} style={{ textDecoration: "none" }}>
      <div
        className="rounded-lg shadow-md transition hover:scale-105"
        style={{
          backgroundColor: "var(--secondary)",
          color: "var(--text)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={movie.image}
            alt={movie.title}
            style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
            }}
          />
          {/* Type badge overlay */}
          <span
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              backgroundColor: "var(--primary)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "3px 10px",
              borderRadius: "999px",
              letterSpacing: "0.5px",
            }}
          >
            {movie.type === "series" ? "Series" : "Movie"}
          </span>
          {/* Rating badge */}
          {movie.rating != null && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "#FBBF24",
                fontSize: "11px",
                fontWeight: "bold",
                padding: "3px 8px",
                borderRadius: "999px",
              }}
            >
              ⭐ {movie.rating}
            </span>
          )}
        </div>

        <div style={{ padding: "12px" }}>
          <h3
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.title}
          </h3>
          {movie.genre && (
            <p style={{ fontSize: "12px", opacity: 0.65, margin: 0 }}>
              {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(", ") : movie.genre}
            </p>
          )}
          {movie.releaseDate && (
            <p style={{ fontSize: "11px", opacity: 0.5, margin: "4px 0 0" }}>
              {new Date(movie.releaseDate).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
