import React, { useState } from "react";

function Dashboard() {
  // Mock data for now
  const [user] = useState({
    username: "Lyn",
    email: "lyn@example.com",
  });

  const [watchlist] = useState([
    { id: 1, title: "Movie 1" },
    { id: 2, title: "Movie 2" },
    { id: 3, title: "Show 1" },
  ]);

  const [favorites] = useState([
    { id: 1, title: "Movie 2" },
    { id: 2, title: "Show 1" },
  ]);

  const [recentlyViewed] = useState([
    { id: 1, title: "Movie 1" },
    { id: 2, title: "Show 2" },
  ]);

  return (
  <main className="dashboard-layout">

    {/* LEFT SIDE - PROFILE */}
    <aside className="profile-section">
      <img
        src="https://via.placeholder.com/100"
        alt="User profile"
        className="profile-pic"
      />

      <h2>{user.username}</h2>
      <p>{user.email}</p>

      {/* Review box */}
      <section className="review-box">
        <h3>Leave a Review</h3>
        <textarea placeholder="Write something..."></textarea>
        <button>Submit</button>
      </section>
    </aside>

    {/* RIGHT SIDE - CONTENT */}
    <section className="content-section">

      {/* Watchlist */}
      <section className="dashboard-section">
        <h3>My Watchlist</h3>
        <ul className="card-grid">
          {watchlist.map((item) => (
            <li key={item.id} className="card">
              {item.title}
            </li>
          ))}
        </ul>
      </section>

      {/* Favorites */}
      <section className="dashboard-section">
        <h3>Favorites</h3>
        <ul className="card-grid">
          {favorites.map((item) => (
            <li key={item.id} className="card">
              {item.title}
            </li>
          ))}
        </ul>
      </section>

      {/* Recently Viewed */}
      <section className="dashboard-section">
        <h3>Recently Viewed</h3>
        <ul className="card-grid">
          {recentlyViewed.map((item) => (
            <li key={item.id} className="card">
              {item.title}
            </li>
          ))}
        </ul>
      </section>

    </section>

  </main>
);
}

export default Dashboard;