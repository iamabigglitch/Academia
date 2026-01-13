import { createContext, useContext, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authtoken");
    return token ? jwtDecode(token) : null;
  });

  const login = (token) => {
    localStorage.setItem("authtoken", token);
    const decoded = jwtDecode(token);
    setUser(decoded); 
  };

  const logout = () => {
    localStorage.removeItem("authtoken");
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);