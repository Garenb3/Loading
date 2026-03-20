import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import { data } from "../data/Data";

export default function ListView() {
  console.log(data);
  return (
    <div className="p-4 min-h-screen bg-gray-900">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-white">Movies & Series</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
      </div>
    </div>
  );
}
