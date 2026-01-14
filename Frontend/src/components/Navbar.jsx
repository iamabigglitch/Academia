import React, { useState, useRef } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import {
  BookOpen,
  Home,
  BookMarked,
  Users,
  Phone,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", icon: Home, href: "/home" },
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "About", icon: BookMarked, href: "/about" },
  { name: "Faculty", icon: Users, href: "/faculty" },
  { name: "Contact", icon: Phone, href: "/contact" },
];

const NavBar = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const menuRef = useRef(null);

  const isAuthenticated = false; // change to true to see avatar
  const user = {
    name: "Jay",
    avatar: "https://i.pravatar.cc/40",
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
                  to="/register"
                  className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="relative group">
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-sky-500 cursor-pointer"
                />

                {/* Avatar Dropdown */}
                <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-sky-50 rounded-t-xl"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/logout"
                    className="block px-4 py-2 hover:bg-sky-50 rounded-b-xl text-red-500"
                  >
                    Logout
                  </NavLink>
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
                    Register
                  </NavLink>
                </>
              ) : (

                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-sky-50 font-semibold"
                >
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  My Profile
                </NavLink>
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
