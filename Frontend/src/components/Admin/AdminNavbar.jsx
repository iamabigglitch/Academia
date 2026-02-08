import React, { useState, useRef, useEffect } from "react";
import { navbarStyles } from "../../assets/dummyStyles";
import logo from "../../assets/logo.png";
import { LayoutDashboard, PlusCircle, ListChecks, ShoppingBag, Menu, X, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const PRIMARY_COLOR = "#1c398e";
const PRIMARY_LIGHT = "#2d4db5";
const PRIMARY_DARK = "#0f2764";

const adminNav = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Add Course", icon: PlusCircle, href: "/admin/addcourse" },
  { name: "List Courses", icon: ListChecks, href: "/admin/listcourse" },
  { name: "Bookings", icon: ShoppingBag, href: "/admin/booking" },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user: contextUser, logout: contextLogout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const menuRef = useRef(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    contextLogout(); 
  };

  const getProfilePhoto = () => {
    if (contextUser && contextUser.profileImage) {
      return `http://localhost:3000/${contextUser.profileImage}`;
    }
    
    if (contextUser && contextUser.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser.username)}&background=1c398e&color=fff&size=128&bold=true`;
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
                alt={contextUser?.username || "Admin"} 
                className="w-10 h-10 rounded-full border-2 cursor-pointer object-cover transition-all hover:scale-110 hover:shadow-lg"
                style={{ borderColor: PRIMARY_COLOR }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser?.username || 'Admin')}&background=1c398e&color=fff&size=128&bold=true`;
                }}
              />

              {/* Avatar Dropdown - FIXED POSITIONING */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 overflow-hidden">
                {/* User Info Header */}
                <div className="px-5 py-4 border-b border-gray-100" style={{ backgroundColor: `${PRIMARY_COLOR}08` }}>
                  <p className="font-bold text-gray-900 text-base">{contextUser?.username || "Admin"}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{contextUser?.email || ""}</p>
                  <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                    Administrator
                  </div>
                </div>

                {/* Profile Link */}
                <NavLink
                  to="/admin/profile"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors group/item"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: `${PRIMARY_COLOR}15` }}>
                    <User size={16} style={{ color: PRIMARY_COLOR }} />
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
              {/* User Info Card */}
              <div 
                className="flex items-center gap-3 px-4 py-4 rounded-xl shadow-sm border"
                style={{ 
                  backgroundColor: `${PRIMARY_COLOR}08`,
                  borderColor: `${PRIMARY_COLOR}20`
                }}
              >
                <img 
                  src={getProfilePhoto()} 
                  alt={contextUser?.username || "Admin"} 
                  className="w-12 h-12 rounded-full object-cover border-2 shadow-md"
                  style={{ borderColor: PRIMARY_COLOR }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser?.username || 'Admin')}&background=1c398e&color=fff&size=128&bold=true`;
                  }}
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{contextUser?.username || "Admin"}</p>
                  <p className="text-xs text-gray-600">{contextUser?.email || ""}</p>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                    Admin
                  </div>
                </div>
              </div>

              {/* Profile Link */}
              <NavLink
                to="/admin/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all shadow-sm"
                style={{ 
                  backgroundColor: PRIMARY_COLOR,
                  color: 'white'
                }}
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