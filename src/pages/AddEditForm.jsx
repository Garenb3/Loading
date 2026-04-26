import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, useToast } from "../components/Toast";
import { authFetch } from "../utils/authService";

const ALL_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Political",
  "Romance",
  "Sci-Fi",
  "Thriller",
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
  cast: "",
  duration: "",
  studio: "",
  trailer: "",
  featured: false,
  trending: false,
  // series-only — seasons.total drives how many ep inputs we show
  seasonsTotal: "",
  episodesPerSeason: [], // array of numbers, one per season
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
      <div
        style={{
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.08)",
          marginBottom: "16px",
        }}
      />
    </div>
  );
}

// ── Fixed image preview ───────────────────────────────────────
function ImagePreview({ src }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!src) return;
    setStatus("loading");
    const img = new Image();
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (!src) return null;

  const boxStyle = {
    width: "120px",
    height: "180px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    flexShrink: 0,
  };

  if (status === "loading")
    return (
      <div style={boxStyle}>
        <span
          style={{
            fontSize: "11px",
            opacity: 0.5,
            textAlign: "center",
            padding: "8px",
          }}
        >
          Loading preview…
        </span>
      </div>
    );
  if (status === "error")
    return (
      <div style={boxStyle}>
        <span
          style={{
            fontSize: "11px",
            opacity: 0.5,
            textAlign: "center",
            padding: "8px",
          }}
        >
          ⚠️ Cannot preview this URL
        </span>
      </div>
    );
  return (
    <img
      src={src}
      alt="Poster preview"
      style={{
        width: "120px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    />
  );
}

export default function AddEditForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [userMedia, setUserMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user || !user.email) navigate("/login");
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchUserMedia() {
      try {
        setLoadingMedia(true);
        const all = await authFetch("/media");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const mine = all.filter(
          (m) => m.createdBy?._id === user?._id || m.createdBy === user?._id,
        );
        setUserMedia(mine);
      } catch {
        // Silently fail
      } finally {
        setLoadingMedia(false);
      }
    }
    fetchUserMedia();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── When seasonsTotal changes, resize the episodesPerSeason array ──
  const handleSeasonsTotal = (e) => {
    const val = e.target.value;
    const n = parseInt(val, 10);
    setForm((prev) => ({
      ...prev,
      seasonsTotal: val,
      episodesPerSeason:
        isNaN(n) || n < 1
          ? []
          : Array.from(
              { length: n },
              (_, i) => prev.episodesPerSeason[i] ?? "",
            ),
    }));
  };

  // ── Update episodes count for a specific season ───────────
  const handleEpisodesChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.episodesPerSeason];
      updated[index] = value;
      return { ...prev, episodesPerSeason: updated };
    });
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
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.releaseDate) newErrors.releaseDate = "Release date is required";
    if (!form.image.trim()) newErrors.image = "Poster URL is required";
    if (
      form.rating &&
      (isNaN(form.rating) || form.rating < 0 || form.rating > 10)
    )
      newErrors.rating = "Rating must be between 0 and 10";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fix the errors before saving.", "error");
      return;
    }

    // Build the nested seasons object that matches the schema
    const seasonsPayload =
      form.type === "series" && form.seasonsTotal
        ? {
            total: parseInt(form.seasonsTotal, 10),
            episodesPerSeason: form.episodesPerSeason.map(
              (v) => parseInt(v, 10) || 0,
            ),
          }
        : undefined;

    const payload = {
      ...form,
      rating: form.rating !== "" ? parseFloat(form.rating) : null,
      duration: form.duration !== "" ? parseInt(form.duration, 10) : null,
      cast: form.cast
        ? form.cast
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      seasons: seasonsPayload,
      // Remove flat form-only fields so they don't pollute the DB doc
      seasonsTotal: undefined,
      episodesPerSeason: undefined,
    };

    try {
      setSubmitting(true);
      if (editingId) {
        const updated = await authFetch(`/media/${editingId}`, "PUT", payload);
        setUserMedia((prev) =>
          prev.map((m) => (m._id === editingId ? updated : m)),
        );
        showToast(`"${form.title}" updated successfully!`, "success");
        setEditingId(null);
      } else {
        const created = await authFetch("/media", "POST", payload);
        setUserMedia((prev) => [created, ...prev]);
        showToast(`"${form.title}" saved successfully!`, "success");
      }
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      showToast(err.message || "Failed to save. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    // Unpack the nested seasons object back into flat form fields
    const seasonsTotal = item.seasons?.total ?? "";
    const episodesPerSeason = item.seasons?.episodesPerSeason ?? [];

    setForm({
      title: item.title || "",
      type: item.type || "movie",
      genre: item.genre || [],
      description: item.description || "",
      releaseDate: item.releaseDate ? item.releaseDate.split("T")[0] : "",
      image: item.image || "",
      rating: item.rating ?? "",
      director: item.director || "",
      cast: Array.isArray(item.cast) ? item.cast.join(", ") : item.cast || "",
      duration: item.duration ?? "",
      studio: item.studio || "",
      trailer: item.trailer || "",
      featured: item.featured || false,
      trending: item.trending || false,
      seasonsTotal: seasonsTotal !== "" ? String(seasonsTotal) : "",
      episodesPerSeason: episodesPerSeason.map(String),
    });
    setEditingId(item._id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await authFetch(`/media/${id}`, "DELETE");
      setUserMedia((prev) => prev.filter((m) => m._id !== id));
      if (editingId === id) {
        setForm(EMPTY_FORM);
        setEditingId(null);
      }
      showToast(`"${title}" deleted.`, "info");
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    }
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        color: "var(--text)",
      }}
    >
      <Sidebar />
      <ToastContainer toasts={toasts} />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 20px 48px",
        }}
      >
        <h1
          style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "6px" }}
        >
          {editingId ? "Edit Entry" : "Add New Entry"}
        </h1>
        <p style={{ opacity: 0.55, fontSize: "14px", marginBottom: "32px" }}>
          {editingId
            ? "Update the details below and save your changes."
            : "Fill in the details to add a new movie or series to the database."}
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
            <Divider title="Core Info" />

            <Field label="Title *">
              <input
                name="title"
                placeholder="e.g. Inception"
                value={form.title}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.title
                    ? "#ef4444"
                    : "rgba(255,255,255,0.15)",
                }}
              />
              {errors.title && (
                <span style={{ color: "#ef4444", fontSize: "12px" }}>
                  {errors.title}
                </span>
              )}
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
                      backgroundColor:
                        form.type === t
                          ? "rgba(229,57,53,0.12)"
                          : "transparent",
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
                    {t === "movie" ? "🎬" : "📺"}{" "}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Genre * (select all that apply)">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                }}
              >
                {ALL_GENRES.map((g) => (
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
                      backgroundColor: form.genre.includes(g)
                        ? "var(--primary)"
                        : "transparent",
                      color: form.genre.includes(g) ? "#fff" : "var(--text)",
                      transition: "all 0.15s",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.genre && (
                <span style={{ color: "#ef4444", fontSize: "12px" }}>
                  {errors.genre}
                </span>
              )}
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
                  borderColor: errors.description
                    ? "#ef4444"
                    : "rgba(255,255,255,0.15)",
                }}
              />
              {errors.description && (
                <span style={{ color: "#ef4444", fontSize: "12px" }}>
                  {errors.description}
                </span>
              )}
            </Field>

            <Divider title="Details" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              <Field label="Release Date *">
                <input
                  type="date"
                  name="releaseDate"
                  value={form.releaseDate}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.releaseDate
                      ? "#ef4444"
                      : "rgba(255,255,255,0.15)",
                    colorScheme: "dark",
                  }}
                />
                {errors.releaseDate && (
                  <span style={{ color: "#ef4444", fontSize: "12px" }}>
                    {errors.releaseDate}
                  </span>
                )}
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
                    borderColor: errors.rating
                      ? "#ef4444"
                      : "rgba(255,255,255,0.15)",
                  }}
                />
                {errors.rating && (
                  <span style={{ color: "#ef4444", fontSize: "12px" }}>
                    {errors.rating}
                  </span>
                )}
              </Field>

              <Field
                label={
                  form.type === "series"
                    ? "Duration (min/ep)"
                    : "Duration (min)"
                }
              >
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

            {/* ── Series-only: Seasons & Episodes ── */}
            {form.type === "series" && (
              <>
                <Divider title="Seasons & Episodes" />

                <Field label="Number of Seasons">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="e.g. 3"
                    value={form.seasonsTotal}
                    onChange={handleSeasonsTotal}
                    style={inputStyle}
                  />
                </Field>

                {/* One input per season, rendered dynamically */}
                {form.episodesPerSeason.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {form.episodesPerSeason.map((eps, i) => (
                      <Field key={i} label={`Season ${i + 1} — Episodes`}>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 10"
                          value={eps}
                          onChange={(e) =>
                            handleEpisodesChange(i, e.target.value)
                          }
                          style={inputStyle}
                        />
                      </Field>
                    ))}
                  </div>
                )}
              </>
            )}

            <Divider title="Media" />

            <Field label="Poster URL *">
              <input
                name="image"
                placeholder="https://…"
                value={form.image}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.image
                    ? "#ef4444"
                    : "rgba(255,255,255,0.15)",
                }}
              />
              {errors.image && (
                <span style={{ color: "#ef4444", fontSize: "12px" }}>
                  {errors.image}
                </span>
              )}
            </Field>

            <ImagePreview src={form.image} />

            <Field label="Trailer URL (YouTube embed)">
              <input
                name="trailer"
                placeholder="https://www.youtube.com/embed/…"
                value={form.trailer}
                onChange={handleChange}
                style={inputStyle}
              />
            </Field>

            <Divider title="Visibility" />

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { name: "featured", label: "⭐ Featured on Home" },
                { name: "trending", label: "🔥 Trending on Home" },
              ].map(({ name, label }) => (
                <label
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--primary)",
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  minWidth: "140px",
                  padding: "13px",
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "15px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Entry"
                    : "Save Entry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
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
                  Cancel Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setErrors({});
                }}
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

        {/* ── My Submissions ── */}
        <div style={{ marginTop: "48px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            My Submissions
          </h2>
          {loadingMedia ? (
            <p style={{ opacity: 0.5 }}>Loading your entries...</p>
          ) : userMedia.length === 0 ? (
            <p style={{ opacity: 0.5 }}>You haven't added any entries yet.</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {userMedia.map((item) => (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: "var(--secondary)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {item.image && (
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/images/${item.image}`
                      }
                      alt={item.title}
                      style={{
                        width: "48px",
                        height: "72px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <p
                      style={{ margin: 0, fontWeight: "700", fontSize: "15px" }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: "12px",
                        opacity: 0.55,
                      }}
                    >
                      {item.type === "movie" ? "🎬 Movie" : "📺 Series"}
                      {item.releaseDate &&
                        ` · ${new Date(item.releaseDate).getFullYear()}`}
                      {item.rating && ` · ⭐ ${item.rating}`}
                      {item.type === "series" &&
                        item.seasons?.total &&
                        ` · ${item.seasons.total} season${item.seasons.total > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "var(--text)",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        width: "auto",
                        marginTop: 0,
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255,77,79,0.1)",
                        border: "1px solid rgba(255,77,79,0.3)",
                        color: "#ff4d4f",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        width: "auto",
                        marginTop: 0,
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
