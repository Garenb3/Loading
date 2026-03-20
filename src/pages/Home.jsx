import { movies } from "../data/movies";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const featured = movies.filter(m => m.featured);
  const trending = movies.filter(m => m.trending);

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />

      <section className="px-6 py-12 text-center" style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
        <h1 className="text-3xl md:text-5xl font-bold">Track Your Favorite Movies</h1>
        <p className="mt-4 text-sm md:text-lg opacity-90">
          Organize, discover, and save movies you love.
        </p>
      </section>

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-left">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-left">Trending</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>
    </div>
  );
}