import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx"; 
import NavBar from "./components/Navbar.jsx"; 
import Banner from "./components/Banner.jsx";
import AboutPage from "./components/AboutPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path = "/about" element={<AboutPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;