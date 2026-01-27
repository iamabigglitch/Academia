import React, { useState, useRef, useEffect } from "react";
import { navbarStyles } from "../../assets/dummyStyles";
import logo from "../../assets/logo.png";
import { LayoutDashboard, PlusCircle, ListChecks, ShoppingBag, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const adminNav = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Add Course", icon: PlusCircle, href: "/admin/addcourse" },
  { name: "List Courses", icon: ListChecks, href: "/admin/listcourse" },
  { name: "Bookings", icon: ShoppingBag, href: "/admin/booking" },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);

  // Get user data
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getProfilePhoto = () => {
    if (user && user.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1c398e&color=fff&size=128&bold=true`;
    }
    return null;
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
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600">
                Academia
              </span>
              <span className="text-xs text-gray-500 font-medium">Admin Panel</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={navbarStyles.desktop}>
            <div className={navbarStyles.desktopNavContainer}>
              {adminNav.map((item) => {
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
            <div className="relative group">
              {/* User Avatar with Photo */}
              <img 
                src={getProfilePhoto()} 
                alt={user?.username || "Admin"} 
                className="w-10 h-10 rounded-full border-2 border-sky-500 cursor-pointer object-cover"
              />

              {/* Avatar Dropdown */}
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  <p className="text-xs text-sky-600 font-medium mt-1">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-sky-50 rounded-b-xl text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
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
            {adminNav.map((item) => {
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
              <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-sky-50">
                <img 
                  src={getProfilePhoto()} 
                  alt={user?.username || "Admin"} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  <p className="text-xs text-sky-600 font-medium">Administrator</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="block w-full text-center px-4 py-3 rounded-xl font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition"
              >
                Logout
              </button>
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

export default AdminNavbar;