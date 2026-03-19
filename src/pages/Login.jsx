import { useState } from "react"
import Navbar from "../components/Navbar"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill all fields")
      return
    }
    if (email === "test@test.com" && password === "1234") {
      alert("Login successful")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <Navbar />
      <div className="flex justify-center items-center py-12">
        <form onSubmit={handleLogin} className="bg-secondary p-6 rounded-lg shadow-md w-80" style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}>
          <h2 className="text-xl font-bold mb-4">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3"
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-3"
            onChange={e => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button className="w-full p-2 rounded" style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}