import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // const stored = localStorage.getItem("role");
    const stored = localStorage.getItem("user");

    try {
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Invalid JSON in localStorage for user");
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    // localStorage.setItem("role", JSON.stringify(userData));
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
