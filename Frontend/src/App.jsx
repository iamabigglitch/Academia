import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import './App.css';
import NavBar from "./components/Navbar.jsx";
import { ArrowUp } from "lucide-react";
import PublicRoutes from "./routes/publicRoutes";
import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/adminRoutes";

// Scroll to top button
const ScrollTopButton = ({ threshold = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-6 bottom-6 z-50 p-2 rounded-full backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer transition-transform focus:outline-none focus:ring-2 focus:ring-sky-300"
    >
      <ArrowUp className="w-6 h-6 text-sky-600 drop-shadow-sm" />
    </button>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {PublicRoutes()}
        {UserRoutes()}
        {AdminRoutes()}
      </Routes>
      <ScrollTopButton threshold={250} />
    </BrowserRouter>
  );
};

export default App;