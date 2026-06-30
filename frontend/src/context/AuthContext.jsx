import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // important: wait until we check the token

  // On mount, check if the user is already logged in (has a cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser({ email });
    return res.data;
  };

  const register = async (email, password) => {
    const res = await api.post("/auth/register", { email, password });
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/logout"); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — so any component can just call useAuth() instead of useContext(AuthContext)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};