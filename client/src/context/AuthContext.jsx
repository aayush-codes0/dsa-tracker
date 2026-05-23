import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user from backend using stored token
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('dsa_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await auth.getMe();
      setUser(data.user || data);
    } catch {
      localStorage.removeItem('dsa_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await auth.login(email, password);
    localStorage.setItem('dsa_token', data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (username, email, password, full_name) => {
    const { data } = await auth.signup(username, email, password, full_name);
    localStorage.setItem('dsa_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('dsa_token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
