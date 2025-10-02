
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // === Robust API URL: remove trailing slash then append /api ===
  const API_BASE = (
    process.env.REACT_APP_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  const API_URL = `${API_BASE}/api`; // ALWAYS contains /api

  // Create axios instance once (memoized)
  const authAxios = useMemo(
    () => axios.create({ baseURL: API_URL }),
    [API_URL]
  );

  useEffect(() => {
    const loadUser = () => {
      if (token) {
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) setUser(storedUser);
          else {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Ensure Authorization header is updated on token change
  useEffect(() => {
    authAxios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token, authAxios]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return true;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      role,
    });

    // If backend ever returns token+user (recommended), auto-save them:
    if (res.data?.token && res.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    // Always return whatever backend sent
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, authAxios }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
