import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import './App.css'

// import components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home/Home";
import Notfound from "./components/Notfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
