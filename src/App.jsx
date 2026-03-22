import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ListView from "./pages/ListView";
import TVShowDetail from "./pages/TVShowDetail";
import MovieDetail from "./pages/MovieDetail";
import AddEditForm from "./pages/AddEditForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listview" element={<ListView />} />
        <Route path="/tv/:id" element={<TVShowDetail />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/add" element={<AddEditForm />} />
        <Route path="/watchlist" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}