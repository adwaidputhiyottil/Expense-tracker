import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext to share authentication state across components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for storing the current user and their authentication token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // useEffect to verify the token and fetch user details on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        // Set global axios detail for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get(
            "https://expense-tracker-wjqs.onrender.com/",
          );
          setUser(res.data.data);
        } catch (err) {
          // If token is invalid or expired, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Function to handle user registration
  const register = async (userData) => {
    const res = await axios.post(
      "https://expense-tracker-wjqs.onrender.com/",
      userData,
    );
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Function to handle user login
  const login = async (userData) => {
    const res = await axios.post(
      "https://expense-tracker-wjqs.onrender.com/",
      userData,
    );
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
