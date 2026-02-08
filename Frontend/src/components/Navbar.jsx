import React, { useState, useRef } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { BookOpen, Home, BookMarked, Users, Phone, Menu, X, BookOpenText, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

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
  const { user: contextUser, logout: contextLogout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const menuRef = useRef(null);

  const isAuthenticated = !!contextUser;
  const navItems = isAuthenticated ? baseNavAuthenticated : baseNavPublic;

  const handleLogout = () => {
    setIsOpen(false);
    contextLogout();
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

  const getProfilePhoto = () => {
    if (contextUser && contextUser.profileImage) {
      return `http://localhost:3000/${contextUser.profileImage}`;
    }
    
    if (contextUser && contextUser.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser.username)}&background=0369a1&color=fff&size=128&bold=true`;
    }
    
    return `https://ui-avatars.com/api/?name=U&background=0369a1&color=fff&size=128&bold=true`;
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
          
          <div className="flex items-center gap-3 select-none">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600">
              Academia
            </span>
          </div>

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
                <img 
                  src={getProfilePhoto()} 
                  alt={contextUser?.username || "User"} 
                  className="w-10 h-10 rounded-full border-2 border-sky-500 cursor-pointer object-cover transition-all hover:scale-110 hover:shadow-lg"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser?.username || 'U')}&background=0369a1&color=fff&size=128&bold=true`;
                  }}
                />

                {/* Enhanced Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-sky-50 to-cyan-50">
                    <p className="font-bold text-gray-900 text-base">{contextUser?.username || "User"}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{contextUser?.email || ""}</p>
                    <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-600 to-cyan-600 text-white">
                      Student
                    </div>
                  </div>

                  {/* Profile Link */}
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-100 transition-colors">
                      <User size={16} className="text-sky-600" />
                    </div>
                    <span className="group-hover/item:translate-x-1 transition-transform">My Profile</span>
                  </NavLink>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-5 py-3 hover:bg-red-50 text-red-600 font-medium transition-colors rounded-b-2xl group/item"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 transition-colors group-hover/item:bg-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                    </div>
                    <span className="group-hover/item:translate-x-1 transition-transform">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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
                  {/* Enhanced User Info Card */}
                  <div className="flex items-center gap-3 px-4 py-4 rounded-xl shadow-sm border bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200">
                    <img 
                      src={getProfilePhoto()} 
                      alt={contextUser?.username || "User"} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-sky-500 shadow-md"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser?.username || 'U')}&background=0369a1&color=fff&size=128&bold=true`;
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{contextUser?.username || "User"}</p>
                      <p className="text-xs text-gray-600">{contextUser?.email || ""}</p>
                      <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-600 to-cyan-600 text-white">
                        Student
                      </div>
                    </div>
                  </div>

                  {/* Profile Link */}
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all shadow-sm bg-gradient-to-r from-sky-600 to-cyan-600 text-white"
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </NavLink>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={navbarStyles.backgroundPattern}>
        <div className={navbarStyles.pattern}></div>
      </div>
    </nav>
  );
};

export default NavBar;