import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx"; 
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NavBar from "./components/Navbar.jsx";
import Faculty from "./pages/Faculty.jsx";
import Courses from "./pages/Courses.jsx";



const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/faculty" element={<Faculty/>} />
        <Route path="/courses" element={<Courses/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;