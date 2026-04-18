import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";

const ALL_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Drama", "Family", "Fantasy", "History", "Horror",
  "Mystery", "Political", "Romance", "Sci-Fi", "Thriller",
];

const EMPTY_FORM = {
  title: "",
  type: "movie",
  genre: [],
  description: "",
  releaseDate: "",
  image: "",
  rating: "",
  director: "",
  cast: "",          // comma-separated → split on save
  duration: "",
  studio: "",
  trailer: "",
  featured: false,
  trending: false,
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.15)",
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  opacity: 0.85,
  marginBottom: "5px",
  display: "block",
};

const sectionTitle = {
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  opacity: 0.5,
  textTransform: "uppercase",
  marginBottom: "12px",
  marginTop: "4px",
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Divider({ title }) {
  return (
    <div style={{ marginTop: "8px" }}>
      <p style={sectionTitle}>{title}</p>
      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", marginBottom: "16px" }} />
    </div>
  );
}

export default function AddEditForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleGenre = (genre) => {
    setForm((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
    }));
    if (errors.genre) setErrors((prev) => ({ ...prev, genre: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (form.genre.length === 0) newErrors.genre = "Select at least one genre";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.releaseDate) newErrors.releaseDate = "Release date is required";
    if (!form.image.trim()) newErrors.image = "Poster URL is required";
    if (form.rating && (isNaN(form.rating) || form.rating < 0 || form.rating > 10))
      newErrors.rating = "Rating must be between 0 and 10";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fix the errors before saving.", "error");
      return;
    }

    // Build full data object matching the data model
    const existing = JSON.parse(localStorage.getItem("userAddedMovies") || "[]");
    const newEntry = {
      ...form,
      id: Date.now(),
      rating: form.rating !== "" ? parseFloat(form.rating) : null,
      duration: form.duration !== "" ? parseInt(form.duration, 10) : null,
      cast: form.cast ? form.cast.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };

    localStorage.setItem("userAddedMovies", JSON.stringify([...existing, newEntry]));
    showToast(`"${form.title}" saved successfully!`, "success");
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "6px" }}>Add / Edit Entry</h1>
        <p style={{ opacity: 0.55, fontSize: "14px", marginBottom: "32px" }}>
          Fill in all details to match the full data model.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              backgroundColor: "var(--secondary)",
              borderRadius: "16px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* ── Core Info ── */}
            <Divider title="Core Info" />

            <Field label="Title *">
              <input
                name="title"
                placeholder="e.g. Inception"
                value={form.title}
                onChange={handleChange}
                style={{ ...inputStyle, borderColor: errors.title ? "#ef4444" : "rgba(255,255,255,0.15)" }}
              />
              {errors.title && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.title}</span>}
            </Field>

            <Field label="Type *">
              <div style={{ display: "flex", gap: "12px" }}>
                {["movie", "series"].map((t) => (
                  <label
                    key={t}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: `2px solid ${form.type === t ? "var(--primary)" : "rgba(255,255,255,0.12)"}`,
                      cursor: "pointer",
                      backgroundColor: form.type === t ? "rgba(var(--primary-rgb),0.12)" : "transparent",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={form.type === t}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    {t === "movie" ? "🎬" : "📺"} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Genre * (select all that apply)">
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                {ALL_GENRES.filter(Boolean).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => toggleGenre(g)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: `1px solid ${form.genre.includes(g) ? "var(--primary)" : "rgba(255,255,255,0.15)"}`,
                      backgroundColor: form.genre.includes(g) ? "var(--primary)" : "transparent",
                      color: form.genre.includes(g) ? "#fff" : "var(--text)",
                      transition: "all 0.15s",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.genre && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.genre}</span>}
            </Field>

            <Field label="Description *">
              <textarea
                name="description"
                placeholder="Brief synopsis…"
                value={form.description}
                onChange={handleChange}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  borderColor: errors.description ? "#ef4444" : "rgba(255,255,255,0.15)",
                }}
              />
              {errors.description && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.description}</span>}
            </Field>

            {/* ── Details ── */}
            <Divider title="Details" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Field label="Release Date *">
                <input
                  type="date"
                  name="releaseDate"
                  value={form.releaseDate}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.releaseDate ? "#ef4444" : "rgba(255,255,255,0.15)",
                    colorScheme: "dark",
                  }}
                />
                {errors.releaseDate && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.releaseDate}</span>}
              </Field>

              <Field label="Rating (0–10)">
                <input
                  type="number"
                  name="rating"
                  placeholder="e.g. 8.5"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.rating ? "#ef4444" : "rgba(255,255,255,0.15)",
                  }}
                />
                {errors.rating && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.rating}</span>}
              </Field>

              <Field label={form.type === "series" ? "Duration (min/ep)" : "Duration (min)"}>
                <input
                  type="number"
                  name="duration"
                  placeholder="e.g. 148"
                  min="1"
                  value={form.duration}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Field>

              <Field label="Studio / Network">
                <input
                  name="studio"
                  placeholder="e.g. Warner Bros."
                  value={form.studio}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Director">
              <input
                name="director"
                placeholder="e.g. Christopher Nolan"
                value={form.director}
                onChange={handleChange}
                style={inputStyle}
              />
            </Field>

            <Field label="Cast (comma-separated)">
              <input
                name="cast"
                placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
                value={form.cast}
                onChange={handleChange}
                style={inputStyle}
              />
            </Field>

            {/* ── Media ── */}
            <Divider title="Media" />

            <Field label="Poster URL *">
              <input
                name="image"
                placeholder="https://…"
                value={form.image}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.image ? "#ef4444" : "rgba(255,255,255,0.15)",
                }}
              />
              {errors.image && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.image}</span>}
            </Field>

            {form.image && (
              <img
                src={form.image}
                alt="Poster preview"
                style={{ width: "120px", height: "180px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}

            <Field label="Trailer URL (YouTube embed)">
              <input
                name="trailer"
                placeholder="https://www.youtube.com/embed/…"
                value={form.trailer}
                onChange={handleChange}
                style={inputStyle}
              />
            </Field>

            {/* ── Flags ── */}
            <Divider title="Visibility" />

            <div style={{ display: "flex", gap: "24px" }}>
              {[
                { name: "featured", label: "⭐ Featured on Home" },
                { name: "trending", label: "🔥 Trending on Home" },
              ].map(({ name, label }) => (
                <label key={name} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* ── Actions ── */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "13px",
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}
                style={{
                  padding: "13px 20px",
                  backgroundColor: "transparent",
                  color: "var(--text)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
