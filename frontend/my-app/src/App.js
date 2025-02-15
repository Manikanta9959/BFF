import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import LoginSignup from "./components/LoginSignup"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginSignup />} />
      </Routes>
    </Router>
  );
};

export default App;
