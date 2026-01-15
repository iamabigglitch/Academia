import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import './App.css'
import Home from "./pages/private/Home.jsx"; 
import About from "./pages/private/About.jsx";
import Contact from "./pages/private/Contact.jsx";
import NavBar from "./components/Navbar.jsx";
import Faculty from "./pages/private/Faculty.jsx";
import Courses from "./pages/private/Courses.jsx";
import { ArrowUp } from "lucide-react";
import CourseDetailPageHome from "./pages/private/CourseDetailPageHome.jsx";
import CourseDetailPage from "./pages/private/CourseDetailPage.jsx";
import Login from "./pages/public/Login.jsx";
import Signup from "./pages/public/Signup.jsx";

//to protect the route
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return Boolean(token);
  };

  if(!isAuthenticated()) {
    return <Navigate to = "/" state={{ from: location }} replace />;
  }
  return children;
};

const ScrollToTopRouteChange = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, left:0, behavior: "auto"});
  } , [location]);

   return null;
   
};

const ScrollTopButton = ({threshold = 200, showOnMount = false}) => {
  const [isVisible, setIsVisible] = useState(!!showOnMount);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={
        "fixed right-6 bottom-6 z-50 p-2 rounded-full focus:outline-none focus:ring-sky-300"
      + "backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer transition-transform"
  }>
    <ArrowUp className="w-6 h-6 text-sky-600 drop-shadow-sm" />
    </button>
    );
};


const App = () => {
  return (
    <>
    
    <BrowserRouter>
      <NavBar />
      <ScrollToTopRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/faculty" element={<Faculty/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path = "/login" element={<Login/>}/>
        <Route path = "/register" element={<Signup/>}/>
        <Route path="/course/:id" element={ <ProtectedRoute><CourseDetailPageHome/></ProtectedRoute>}/>
        <Route path="/courses/:id" element={ <ProtectedRoute><CourseDetailPage/></ProtectedRoute>}/>
        
      </Routes>
         <ScrollTopButton threshold={250}  />
    </BrowserRouter>
 
    </>
  );
};

export default App;