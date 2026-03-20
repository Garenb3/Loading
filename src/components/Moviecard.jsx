import { Link } from "react-router-dom";

export default function MovieCard({ movie, isTV = false }) {
  console.log(movie.genre, Array.isArray(movie.genre));
  return (
    <Link to={isTV ? `/tv/${movie.id}` : `/tv/${movie.id}`}>
      <div
        className="rounded-lg shadow-md p-4 transition hover:scale-105"
        style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
      >
        <img
          src={movie.image}
          alt={movie.title}
          className="rounded-md w-full h-72 object-cover"
        />
        <h3 className="font-bold mt-3 text-base">{movie.title}</h3>
        {movie.genre && (
          <p className="mt-1" style={{ opacity: 0.7 }}>
            {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
          </p>
        )}{" "}
      </div>
    </Link>
  );
}
