import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('coinly_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('coinly_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('coinly_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('coinly_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
