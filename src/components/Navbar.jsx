export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      {/* Logo / Title */}
      <h1 className="text-xl font-bold">
        MovieTracker
      </h1>

      {/* Navigation links */}
      <div className="flex gap-6">

        <a href="/" className="hover:text-gray-300">
          Home
        </a>

        <a href="/browse" className="hover:text-gray-300">
          Browse
        </a>

        <a href="/watchlist" className="hover:text-gray-300">
          Watchlist
        </a>

        <a href="/login" className="hover:text-gray-300">
          Login
        </a>

      </div>

    </nav>
  )
}