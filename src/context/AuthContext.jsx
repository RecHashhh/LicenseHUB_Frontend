import { createContext, useContext, useMemo, useState } from "react";
import { loginRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const login = async (email, password) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    const resolvedRole = data.role || "user";
    localStorage.setItem("role", resolvedRole);
    setRole(resolvedRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("user");
  };

  const value = useMemo(() => ({ token, role, login, logout }), [token, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
