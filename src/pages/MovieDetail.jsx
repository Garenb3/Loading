import { useParams } from "react-router-dom";
import data from "../data/mockData";

export default function MovieDetail() {
  const { id } = useParams();
  const movie = data.find((item) => item.id === parseInt(id));

  return (
    <div className="p-4">
      <img src={movie.poster} alt={movie.title} />
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <p>{movie.description}</p>
      <p>⭐ {movie.rating}</p>

      <button className="bg-blue-500 text-white px-4 py-2 mt-4">
        Add to Watchlist
      </button>
    </div>
  );
}
