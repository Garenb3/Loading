// ============================================================
//  db/movies.js
//  In-memory movies/shows "database"
//  Seeded with the same 60 entries from src/data/Data.js
// ============================================================

export const movies = [
  { id: 1, title: "Inception", type: "movie", genre: ["Sci-Fi","Action","Thriller"], featured: true, trending: true, image: "/images/Inception.jpg", duration: 148, releaseDate: "2010", rating: 8.8, director: "Christopher Nolan", studio: "Warner Bros.", cast: ["Leonardo DiCaprio","Joseph Gordon-Levitt","Elliot Page","Tom Hardy"], description: "A skilled thief who specializes in corporate espionage by infiltrating the subconscious is offered a chance to have his criminal history erased.", trailer: "https://www.youtube.com/embed/YoHD9XEInc0", ownerId: null },
  { id: 2, title: "Stranger Things", type: "series", genre: ["Sci-Fi","Horror","Drama"], featured: true, trending: true, image: "/images/Stranger Things.jpg", duration: 50, releaseDate: "2016", rating: 8.7, director: "The Duffer Brothers", studio: "Netflix", cast: ["Millie Bobby Brown","Finn Wolfhard","David Harbour"], description: "Set in the 1980s, a group of young friends witness supernatural forces and secret government exploits.", seasons: { total: 4, episodesPerSeason: [8,9,8,9] }, trailer: "https://www.youtube.com/embed/b9EkMc79ZSU", ownerId: null },
  { id: 3, title: "The Dark Knight", type: "movie", genre: ["Action","Crime","Drama"], featured: true, trending: false, image: "/images/The Dark Knight.jpg", duration: 152, releaseDate: "2008", rating: 9.0, director: "Christopher Nolan", studio: "Warner Bros.", cast: ["Christian Bale","Heath Ledger","Aaron Eckhart"], description: "Batman raises the stakes in his war on crime.", trailer: "https://www.youtube.com/embed/EXeTwQWrcwY", ownerId: null },
  { id: 4, title: "Breaking Bad", type: "series", genre: ["Crime","Drama","Thriller"], featured: true, trending: false, image: "/images/Breaking Bad.jpg", duration: 47, releaseDate: "2008", rating: 9.5, director: "Vince Gilligan", studio: "AMC", cast: ["Bryan Cranston","Aaron Paul"], description: "A high school chemistry teacher diagnosed with terminal cancer turns to manufacturing methamphetamine.", seasons: { total: 5, episodesPerSeason: [7,13,13,13,16] }, trailer: "https://www.youtube.com/embed/HhesaQXLuRY", ownerId: null },
  { id: 5, title: "The Shawshank Redemption", type: "movie", genre: ["Drama"], featured: true, trending: false, image: "/images/The Shawshank Redemption.jpg", duration: 142, releaseDate: "1994", rating: 9.3, director: "Frank Darabont", studio: "Columbia Pictures", cast: ["Tim Robbins","Morgan Freeman"], description: "Wrongly convicted of murder, banker Andy Dufresne begins a new life at Shawshank prison.", trailer: "https://www.youtube.com/embed/PLl99DlL6b4", ownerId: null },
  { id: 60, title: "Oppenheimer", type: "movie", genre: ["Drama","History","Biography"], featured: true, trending: false, image: "/images/Oppenheimer.jpg", duration: 180, releaseDate: "2023", rating: 8.9, director: "Christopher Nolan", studio: "Universal Pictures", cast: ["Cillian Murphy","Robert Downey Jr.","Emily Blunt"], description: "The story of physicist J. Robert Oppenheimer and his role in the development of the atomic bomb.", trailer: "https://www.youtube.com/embed/uYPbbksJxIg", ownerId: null },
];

let nextId = 61; // starts after seeded data

export function getAllMovies() {
  return movies;
}

export function getMovieById(id) {
  return movies.find((m) => m.id === Number(id)) || null;
}

export function createMovie(data) {
  const movie = { ...data, id: nextId++ };
  movies.push(movie);
  return movie;
}

export function updateMovie(id, updates) {
  const idx = movies.findIndex((m) => m.id === Number(id));
  if (idx === -1) return null;
  movies[idx] = { ...movies[idx], ...updates, id: movies[idx].id };
  return movies[idx];
}

export function deleteMovie(id) {
  const idx = movies.findIndex((m) => m.id === Number(id));
  if (idx === -1) return false;
  movies.splice(idx, 1);
  return true;
}