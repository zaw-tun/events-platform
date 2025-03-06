import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
// import Login from "./pages/Login";
// import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} /> */}
    </Routes>
  );
}

export default App;
