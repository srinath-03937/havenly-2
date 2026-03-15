import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import { getCurrentTabId, getCurrentTabToken, getCurrentTabUser, clearCurrentTabAuth } from '../utils/tabManager';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [tabId] = useState(() => getCurrentTabId());

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // Get auth data using tabManager utilities
    const token = getCurrentTabToken();
    const user = getCurrentTabUser();
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setToken(token);
        setUser(userData);
        
        // Store in tab-specific localStorage for persistence
        localStorage.setItem(`token_${tabId}`, token);
        localStorage.setItem(`user_${tabId}`, user);
        
        // Also store in sessionStorage for current tab
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', user);
        sessionStorage.setItem(`user_${tabId}`, user);
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        // Clear corrupted data
        clearCurrentTabAuth();
      }
    }
    setLoading(false);
  }, [tabId]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_logout') {
        // Another tab logged out, clear this tab's auth
        setUser(null);
        setToken(null);
        sessionStorage.clear();
      }
      // Remove auth_login conflict detection - allow different accounts in different tabs
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [tabId]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;
      
      // Store in tab-specific localStorage keys
      localStorage.setItem(`token_${tabId}`, token);
      localStorage.setItem(`user_${tabId}`, JSON.stringify(user));
      
      // Also store in sessionStorage for current tab
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem(`user_${tabId}`, JSON.stringify(user));
      
      setUser(user);
      setToken(token);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }, [tabId]);

  const register = useCallback(async (data) => {
    try {
      const response = await authAPI.register(data);
      const { user, token } = response.data;
      
      // Store in tab-specific localStorage keys
      localStorage.setItem(`token_${tabId}`, token);
      localStorage.setItem(`user_${tabId}`, JSON.stringify(user));
      
      // Also store in sessionStorage for current tab
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem(`user_${tabId}`, JSON.stringify(user));
      
      setUser(user);
      setToken(token);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }, [tabId]);

  const logout = useCallback(() => {
    // Clear auth using tabManager utility
    setUser(null);
    setToken(null);
    clearCurrentTabAuth();
    
    // Notify other tabs about logout
    localStorage.setItem('auth_logout', Date.now().toString());
    
    // Redirect to login page
    window.location.href = '/login';
  }, [tabId]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
