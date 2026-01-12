import React, { useState, useRef, useEffect } from "react";
import {navbarStyles} from "../assets/dummyStyles";
import logo from '../assets/logo.png'
import { BookOpen, Home, BookMarked, Users, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";


const navItems = [
  { name: "Home", icon: Home, href: "/home" },
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "About", icon: BookMarked, href: "/about" },
  { name: "Faculty", icon: Users, href: "/faculty" },
  { name: "Contact", icon: Phone, href: "/contact" },
];


const NavBar = () => {

    //for mobile toggle

    const [isOpen, setIsOpen] =  useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [isScrolled, setIsScrolled] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);

    const menuRef = useRef(null);
    const isLoggedIn = isSignedIn && Boolean(localStorage.getItem("token")); // Replace with actual authentication logic

    // fetch Token
    useEffect(() => {
        const loadToken = () => {
            if (isSignedIn){
                const token = await getToken();
                localStorage.setItem("token", token);
                console.log("Token stored in localStorage");
            }
        };
        loadToken();
    }, [isSignedIn, getToken]);

    //remove token when signed out
    useEffect(() => {
        if (!isSignedIn) {
            localStorage.removeItem("token");
            console.log("Token removed from localStorage");
        }
    }, [isSignedIn]);

    const desktopLinkClass = (isActive) => 
        `${navbarStyles.desktopNavItem}${
            isActive 
            ? navbarStyles.desktopNavItemActive 
            : ""
        }`;

        const mobileLinkClass = (isActive) =>
            `${navbarStyles.mobileMenuItem} ${
                isActive 
                ? navbarStyles.mobileMenuItemActive 
                : navbarStyles.mobileMenuItemHover
            }`

    return(
    <nav className = { `${navbarStyles.navbar} ${
        showNavbar 
        ? navbarStyles.navbarVisible 
        : navbarStyles.navbarHidden
    }${
       isScrolled 
       ? navbarStyles.navbarScrolled 
       : navbarStyles.navbarDefault 
    }`} >

        <div className= {navbarStyles.container}>
            <div className= {navbarStyles.innerContainer}>

                {/*  Logo  */}
                <div className= "flex items-center gap-3 select-none">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600">
                    Academia
                    </div>

                    {/* {Desktop Navigation } */}
                    <div className = {navbarStyles.desktop}>
                        <div className= {navbarStyles.desktopNavContainer}>
                            {navItems.map(item => {
                                const Icon = item.icon;
                                return(
                                    <NavLink key = {item.name} to={item.href} end={item.href === '/'} 

                                    className = {({isActive}) => desktopLinkClass(isActive)}>

                                        <div className="flex items-center space-x-2">
                                            <Icon size = {16} className={navbarStyles.desktopNavIcon} />
                                            <span className = {navbarStyles.desktopNavText}>
                                                {item.name}

                                            </span>
                                        </div>

                                    </NavLink>
                                )
                            })}

                        </div>
                    </div>

                    {/* Right Side */}
                    <div className={navbarStyles.authContainer}>
                    {!isSignedIn ? (
                        <button type = "button" 
                        onClick={() => openSignUp({})}
                        className={navbarStyles.createAccountButton ?? navbarStyles.loginButton}>
                            <span>
                                Create Account
                            </span>
                            </button>
                    ) : null}

                // toggle button for mobile menu
                <button
                onClick={() => setIsOpen(!isOpen)}
                className = {navbarStyles.mobileMenuButton}>
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                        </div>
                    </div>

                    // Mobile Menu
                    <div 
                    ref={menuRef}
                    className = {`${navbarStyles.mobileMenu} ${
                        isOpen 
                        ? navbarStyles.mobileMenuOpen 
                        : navbarStyles.mobileMenuClosed
                    }`}>

                        <div className={navbarStyles.mobileMenuContainer}>
                            <div className={navbarStyles.mobileMenuItems}>
                                {navItems.map(item => {
                                    const Icon = item.icon;
                                    return(
                                        <NavLink 
                                        key={item.name} 
                                        to={item.href} 
                                        end={item.href === '/'}
                                        className = {({isActive}) => mobileLinkClass(isActive)}
                                        onClick={() => setIsOpen(false)}>

                                            <div className= {navbarStyles.mobileMenuIconContainer}>
                                                <Icon size = {18} className={navbarStyles.mobileMenuIcon} />
                                                </div>
                                                <span className = {navbarStyles.mobileMenuText}>
                                                    {item.name}
                                                </span>
                                        </NavLink>
                                    );
                                })}

                                (!isSignedIn ? (
                                    <button
                                    type="button"
                                    onClick={() => {
                                        openSignUp({});
                                        setIsOpen(false);
                                    }}
                                    className={navbarStyles.mobileCreateAccountButton 
                                        ?? navbarStyles.mobileLoginButton}>
                                        <span>
                                            Create Account
                                        </span>
                                    </button>
                                ) : null)

                            </div>
                        </div>
                    </div>
                </div>

                <div className={navbarStyles.backgroundPattern}>
                    <div className={navbarStyles.pattern}></div>
                </div>
            </div>
    </nav>
    );
};

export default NavBar;