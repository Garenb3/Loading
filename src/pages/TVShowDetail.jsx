import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { tvShows } from "../data/tvshows";

export default function TVShowDetail() {
  const { id } = useParams();
  const [added, setAdded] = useState(false);

  const show = tvShows.find(s => s.id === parseInt(id));
  if (!show) return <p>Show not found</p>;

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <img src={show.image} className="w-full md:w-1/3 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold">{show.title}</h1>
            <p className="mt-2 opacity-70">⭐ {show.rating}</p>
            <p className="mt-4">{show.description}</p>
            <h2 className="mt-6 font-bold text-xl">Seasons</h2>
            <ul className="mt-2">
              {show.seasons.map((s, i) => <li key={i}>Season {s.season} — {s.episodes} Episodes</li>)}
            </ul>
            <button
              onClick={() => setAdded(true)}
              className="mt-6 px-4 py-2 rounded"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            >
              {added ? "Added ✓" : "Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}