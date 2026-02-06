import { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    return token ? jwtDecode(token) : null;
  });

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    
    // Preserve role and other user data from token decode
    const userData = {
      id: decodedUser.id,
      username: decodedUser.username,
      email: decodedUser.email,
      role: decodedUser.role || "user"
    };
    
    // Update localStorage user data with decoded token info to keep role in sync
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);