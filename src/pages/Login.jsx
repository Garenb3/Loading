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
    <div className="flex justify-center items-center h-screen">
        <Navbar />
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >

        <h2 className="text-xl font-bold mb-4">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>

      </form>

    </div>
  )
}