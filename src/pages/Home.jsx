import { movies } from "../data/movies"
import MovieCard from "../components/Moviecard"
import Navbar from "../components/Navbar"

export default function Home() {

  const featured = movies.filter(m => m.featured)
  const trending = movies.filter(m => m.trending)

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="p-10 bg-gray-900 text-white text-center">
        <h1 className="text-4xl font-bold">
          Track Your Favorite Movies
        </h1>
      </section>

      {/* Featured */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Featured
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {featured.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Trending
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {trending.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

    </div>
  )
}