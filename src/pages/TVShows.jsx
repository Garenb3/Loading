import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { tvShows } from "../data/tvshows";

export default function TVShows() {
  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-left">TV Shows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tvShows.map(show => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      </section>
    </div>
  )
}