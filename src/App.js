import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

import "./App.css";

// import components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home/Home";
import Notfound from "./components/Notfound";
import Navbar from "./components/Navbar";
import ViewDatasets from "./pages/Datasets/ViewDatasets";
import Profile from "./pages/Profile/Profile";
import AllDatasets from "./pages/Datasets/AllDatasets";
import Dashboard from "./pages/Admin/Dashboard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/datasets" element={<AllDatasets />} />
        <Route path="/datasets/:datasets_id" element={<ViewDatasets />} />
        <Route path="/datasets/:datasets_id/discussions" element={<ViewDatasets />} />
        <Route path="/datasets/:datasets_id/discussions/:topic_id" element={<ViewDatasets />} />
        <Route path="/datasets/:datasets_id/settings" element={<ViewDatasets />} />
        <Route path="/datasets/:datasets_id/article" element={<ViewDatasets />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/:username/datasets" element={<Profile />} />
        <Route path="/profile/:username/bookmarks" element={<Profile />} />
        <Route path="/profile/:username/reports" element={<Profile />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;

/*
<Route path={"/dashboard"} element={
  <RequireAuth loginPath={"/login"}>
    <Dashboard />
  </RequireAuth>
} />
*/