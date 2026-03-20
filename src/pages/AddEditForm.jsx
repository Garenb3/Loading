import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AddEditForm() {
  const [form, setForm] = useState({ title:"", genre:"", description:"", releaseDate:"", image:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.genre || !form.description || !form.releaseDate || !form.image) {
      setError("Please fill all fields");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Saved successfully!");
    console.log(form);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor:"var(--bg)", color:"var(--text)" }}>
      <Navbar />
      <div className="flex justify-center items-center py-12">
        <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md w-96" style={{ backgroundColor:"var(--secondary)" }}>
          <h2 className="text-xl font-bold mb-4">Add / Edit Movie</h2>

          <input name="title" placeholder="Title" className="border p-2 w-full mb-3" onChange={handleChange} />
          <input name="genre" placeholder="Genre" className="border p-2 w-full mb-3" onChange={handleChange} />
          <textarea name="description" placeholder="Description" className="border p-2 w-full mb-3" onChange={handleChange} />
          <input type="date" name="releaseDate" className="border p-2 w-full mb-3" onChange={handleChange} />
          <input name="image" placeholder="Poster URL" className="border p-2 w-full mb-3" onChange={handleChange} />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

          <button className="w-full p-2 rounded" style={{ backgroundColor:"var(--primary)", color:"#fff" }}>Save</button>
        </form>
      </div>
    </div>
  )
}