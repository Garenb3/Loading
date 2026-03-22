import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TVShowDetail from "./pages/TVShowDetail"
import TVShows from "./pages/TVShows"
import AddEditForm from "./pages/AddEditForm"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/TVShowDetail" element={<TVShowDetail />} />
        <Route path="/TVShows" element={<TVShows />} />
        <Route path="/AddEditForm" element={<AddEditForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;