import React, { useState, useRef, useEffect } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { BookOpen, Home, BookMarked, Users, Phone, Menu, X, BookOpenText, User as UserIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const baseNavPublic = [
  { name: "Home", icon: Home, href: "/" },
  { name: "About", icon: BookMarked, href: "/about" },
  { name: "Faculty", icon: Users, href: "/faculty" },
  { name: "Contact", icon: Phone, href: "/contact" },
];

const baseNavAuthenticated = [
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "My Courses", icon: BookOpenText, href: "/mycourses" },
  { name: "About", icon: BookMarked, href: "/about" },
  { name: "Faculty", icon: Users, href: "/faculty" },
  { name: "Contact", icon: Phone, href: "/contact" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);

  // Check if user is authenticated and get user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      
      // Get user data from localStorage (saved during login/signup)
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const navItems = isAuthenticated ? baseNavAuthenticated : baseNavPublic;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setIsOpen(false);
    navigate("/");
  };

  const desktopLinkClass = (isActive) =>
    `${navbarStyles.desktopNavItem}${
      isActive ? navbarStyles.desktopNavItemActive : ""
    }`;

  const mobileLinkClass = (isActive) =>
    `${navbarStyles.mobileMenuItem} ${
      isActive
        ? navbarStyles.mobileMenuItemActive
        : navbarStyles.mobileMenuItemHover
    }`;

  // // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };


  const getProfilePhoto = () => {
    if (user && user.username) {
      
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=0369a1&color=fff&size=128&bold=true`;
    }
    return null;
  };

  return (
    <nav
      className={`${navbarStyles.navbar} ${
        showNavbar
          ? navbarStyles.navbarVisible
          : navbarStyles.navbarHidden
      } ${
        isScrolled
          ? navbarStyles.navbarScrolled
          : navbarStyles.navbarDefault
      }`}
    >
      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600">
              Academia
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className={navbarStyles.desktop}>
            <div className={navbarStyles.desktopNavContainer}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      desktopLinkClass(isActive)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4 ml-6">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="relative group">
                {/* User Avatar with Photo */}
                <img 
                  src={getProfilePhoto()} 
                  alt={user?.username || "User"} 
                  className="w-10 h-10 rounded-full border-2 border-sky-500 cursor-pointer object-cover"
                />

                {/* Avatar Dropdown */}
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{user?.username || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-sky-50 text-gray-700"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-sky-50 rounded-b-xl text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={navbarStyles.mobileMenuButton}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`${navbarStyles.mobileMenu} ${
          isOpen
            ? navbarStyles.mobileMenuOpen
            : navbarStyles.mobileMenuClosed
        }`}
      >
        <div className={navbarStyles.mobileMenuContainer}>
          <div className={navbarStyles.mobileMenuItems}>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    mobileLinkClass(isActive)
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Mobile Auth */}
            <div className="mt-6 space-y-3">
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl font-semibold text-sky-700 border border-sky-200 hover:bg-sky-50 transition"
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all"
                  >
                    Signup
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-sky-50">
                    <img 
                      src={getProfilePhoto()} 
                      alt={user?.username || "User"} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{user?.username || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email || ""}</p>
                    </div>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl font-semibold text-sky-700 border border-sky-200 hover:bg-sky-50 transition"
                  >
                    My Profile
                  </NavLink>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-3 rounded-xl font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className={navbarStyles.backgroundPattern}>
        <div className={navbarStyles.pattern}></div>
      </div>
    </nav>
  );
};

export default NavBar;