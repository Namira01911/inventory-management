import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("inventory_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("inventory_token") || null;
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:8080/auth/login", {
      email,
      password,
    });

    const data = response.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("inventory_token", data.token);
    localStorage.setItem("inventory_user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    // Public registration ALWAYS registers as CUSTOMER on the backend
    const response = await axios.post("http://localhost:8080/auth/register", {
      name,
      email,
      password,
    });

    const data = response.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("inventory_token", data.token);
    localStorage.setItem("inventory_user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("inventory_token");
    localStorage.removeItem("inventory_user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
