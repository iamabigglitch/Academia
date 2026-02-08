import { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    console.log("=== AUTH CONTEXT INIT ===");
    console.log("Token exists:", !!token);
    console.log("Stored user:", storedUser);
    
    if (!token) {
      console.log("No token found");
      return null;
    }
    
    try {
      const decodedUser = jwtDecode(token);
      console.log("Decoded JWT:", decodedUser);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed stored user:", parsedUser);
        
        // Merge both - prioritize stored user data (has profileImage, etc)
        // but ensure role comes from decoded token as backup
        const mergedUser = {
          id: parsedUser.id || decodedUser.id,
          username: parsedUser.username || decodedUser.username,
          email: parsedUser.email || decodedUser.email,
          role: parsedUser.role || decodedUser.role,
          profileImage: parsedUser.profileImage
        };
        console.log("Final merged user:", mergedUser);
        console.log("========================");
        return mergedUser;
      }
      
      console.log("Using decoded user only");
      console.log("========================");
      return decodedUser;
    } catch (error) {
      console.error("Error initializing auth:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (token, userData) => {
    console.log("=== LOGIN CALLED ===");
    console.log("Token:", token);
    console.log("User data:", userData);
    
    localStorage.setItem("token", token);
    
    try {
      const decodedUser = jwtDecode(token);
      console.log("Decoded token:", decodedUser);
      
      // Merge server user data with decoded token
      const mergedUser = {
        id: userData.id || decodedUser.id,
        username: userData.username || decodedUser.username,
        email: userData.email || decodedUser.email,
        role: userData.role || decodedUser.role,
        profileImage: userData.profileImage
      };
      
      console.log("Merged user for storage:", mergedUser);
      
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
      console.log("User state updated");
      console.log("===================");
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  const logout = () => {
    console.log("=== LOGOUT CALLED ===");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    console.log("User logged out");
    console.log("====================");
    // Force page reload to home to ensure clean state
    window.location.href = "/";
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);