import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state on app mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('user_role');
    const storedEmail = localStorage.getItem('user_email');

    if (storedToken) {
      setToken(storedToken);
      setUser({
        email: storedEmail || '',
        role: storedRole || 'Student',
      });
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback((authData) => {
    const { token, email, role } = authData;
    localStorage.setItem('token', token);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_role', role);

    setToken(token);
    setUser({ email, role });
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    userRole: user?.role || 'Student',
    isTrainer: user?.role === 'Trainer' || user?.role === 'Teacher',
    isAdmin: user?.role === 'Admin',
    isStudent: user?.role === 'Student',
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};