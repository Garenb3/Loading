export default function MovieCard({ movie }) {
  return (
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
      <p className="mt-1" style={{ opacity: 0.7 }}>{movie.genre}</p>
    </div>
  )
}