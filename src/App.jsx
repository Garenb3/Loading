import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TVShowDetail from "./pages/TVShowDetail";
import AddEditForm from "./pages/AddEditForm";
import TVShows from "./pages/TVShows";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tv/:id" element={<TVShowDetail />} />
        <Route path="/add" element={<AddEditForm />} />
        <Route path="/tv" element={<TVShows />} />
      </Routes>
    </BrowserRouter>
  )
}