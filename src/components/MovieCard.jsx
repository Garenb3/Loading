import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const path = movie.type === "series" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <Link to={path}>
      <div
        className="rounded-lg shadow-md p-4 transition hover:scale-105"
        style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
      >
        <img
          src={movie.image}
          alt={movie.title}
          className="rounded-md w-full h-72 object-cover"
          onError={e => { e.target.src = "https://via.placeholder.com/300x400?text=No+Image"; }}
        />
        <h3 className="font-bold mt-3 text-base">{movie.title}</h3>
        {movie.genre && (
          <p className="mt-1 text-sm" style={{ opacity: 0.7 }}>
            {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(", ") : movie.genre}
          </p>
        )}
        <span
          className="inline-block mt-2 text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          {movie.type === "series" ? "Series" : "Movie"}
        </span>
      </div>
    </Link>
  );
}