import React, { useState, useRef, useEffect } from "react";
import { navbarStyles } from "../../assets/dummyStyles";
import logo from "../../assets/logo.png";
import { LayoutDashboard, PlusCircle, ListChecks, ShoppingBag, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#1c398e";
const PRIMARY_LIGHT = "#2d4db5";
const PRIMARY_DARK = "#0f2764";

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

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getProfilePhoto = () => {
    if (user && user.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1c398e&color=fff&size=128&bold=true`;
    }
    return "https://ui-avatars.com/api/?name=Admin&background=1c398e&color=fff&size=128&bold=true";
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
      style={{
        background: isScrolled 
          ? `linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.98))`
          : `linear-gradient(to bottom, rgba(28,57,142,0.05), rgba(255,255,255,0.95))`
      }}
    >
      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <div className="flex flex-col">
              <span 
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${PRIMARY_COLOR}, ${PRIMARY_LIGHT})`
                }}
              >
                Academia
              </span>
              <span className="text-xs font-medium" style={{ color: PRIMARY_COLOR }}>Admin Panel</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={navbarStyles.desktopNav}>
            <div className={navbarStyles.desktopNavContainer}>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isDashboard = item.href === "/admin" && item.name === "Dashboard";
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={isDashboard}
                    className={({ isActive }) =>
                      desktopLinkClass(isActive)
                    }
                    style={({ isActive }) => ({
                      background: isActive 
                        ? `linear-gradient(to right, ${PRIMARY_COLOR}, ${PRIMARY_LIGHT})`
                        : 'transparent',
                      color: isActive ? 'white' : 'inherit'
                    })}
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
          <div className={navbarStyles.authContainer}>
            <div className="relative group">
              {/* User Avatar with Photo */}
              <img 
                src={getProfilePhoto()} 
                alt={user?.username || "Admin"} 
                className="w-10 h-10 rounded-full border-2 cursor-pointer object-cover transition-all hover:scale-110"
                style={{ borderColor: PRIMARY_COLOR }}
              />

              {/* Avatar Dropdown */}
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: PRIMARY_COLOR }}>Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 rounded-b-xl text-red-500 transition-colors"
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
            style={{ borderColor: PRIMARY_COLOR }}
          >
            {isOpen ? <X size={20} style={{ color: PRIMARY_COLOR }} /> : <Menu size={20} style={{ color: PRIMARY_COLOR }} />}
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
              const isDashboard = item.href === "/admin" && item.name === "Dashboard";
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={isDashboard}
                  className={({ isActive }) =>
                    mobileLinkClass(isActive)
                  }
                  style={({ isActive }) => ({
                    background: isActive 
                      ? `linear-gradient(to right, ${PRIMARY_COLOR}, ${PRIMARY_LIGHT})`
                      : 'transparent',
                    color: isActive ? 'white' : 'inherit'
                  })}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Mobile Auth */}
            <div className="mt-6 space-y-3">
              <div 
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: `${PRIMARY_COLOR}15` }}
              >
                <img 
                  src={getProfilePhoto()} 
                  alt={user?.username || "Admin"} 
                  className="w-10 h-10 rounded-full object-cover border-2"
                  style={{ borderColor: PRIMARY_COLOR }}
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  <p className="text-xs font-medium" style={{ color: PRIMARY_COLOR }}>Administrator</p>
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