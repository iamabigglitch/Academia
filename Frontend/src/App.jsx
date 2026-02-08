import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import NavBar from "./components/Navbar.jsx";
import AdminNavbar from "./components/Admin/AdminNavbar.jsx";
import { ArrowUp } from "lucide-react";
import PublicRoutes from "./routes/publicRoutes";
import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/adminRoutes";
import { AuthProvider, useAuth } from "./context/authContext";


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
      style={{ backgroundColor: '#1c398e' }}
    >
      <ArrowUp className="w-6 h-6 text-white drop-shadow-sm" />
    </button>
  );
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdminRoute = location.pathname.startsWith('/admin') || user?.role === 'admin';

  useEffect(() => {
    
    if (location.pathname === '/' && user) {
      console.log('Auto-redirect: User detected, redirecting based on role');
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/courses', { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <NavBar />}
      <Routes>
        {PublicRoutes()}
        {UserRoutes()}
        {AdminRoutes()}
      </Routes>
      <ScrollTopButton threshold={250} />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;