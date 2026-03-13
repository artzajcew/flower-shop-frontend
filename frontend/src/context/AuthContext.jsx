import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (err) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError('');
      const response = await apiLogin(username, password);
      const { access_token, is_admin, username: userName, user_id } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser({
        id: user_id,
        username: userName,
        isAdmin: is_admin
      });
      
      return { success: true, isAdmin: is_admin };
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      setError(err.response?.data?.detail || 'Ошибка входа');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      await apiRegister(userData);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err.response?.data || err);
      setError(err.response?.data?.detail || 'Ошибка регистрации');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}