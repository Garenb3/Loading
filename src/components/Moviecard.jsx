export default function MovieCard({ movie }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      <img
        src={movie.image}
        alt={movie.title}
        className="rounded-md"
      />

      <h3 className="font-bold mt-2">{movie.title}</h3>

      <p className="text-sm text-gray-500">
        {movie.genre}
      </p>
    </div>
  )
}