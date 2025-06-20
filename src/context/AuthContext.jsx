import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken } from "../services/authService";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) setUser(userData);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
