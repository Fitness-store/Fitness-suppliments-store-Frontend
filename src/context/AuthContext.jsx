import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  logoutUser,
  refreshAuthSession,
  signupUser,
  googleLoginUser,
  fetchMe,
  setAccessToken,
  clearAccessToken,
} from '../services/api';
import { AuthContext } from './authContextObject';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const applyAuth = useCallback((response) => {
    if (response?.accessToken) {
      setAccessToken(response.accessToken);
    }
    if (response?.user) {
      setCurrentUser(response.user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (payload) => {
    const response = await loginUser(payload);
    applyAuth(response);
    return response;
  }, [applyAuth]);

  const signup = useCallback(async (payload) => {
    const response = await signupUser(payload);
    applyAuth(response);
    return response;
  }, [applyAuth]);

  const googleLogin = useCallback(async (credential) => {
    const response = await googleLoginUser(credential);
    applyAuth(response);
    return response;
  }, [applyAuth]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await refreshAuthSession();
      applyAuth(response);
      return true;
    } catch {
      clearAccessToken();
      setCurrentUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, [applyAuth]);

  const loadMe = useCallback(async () => {
    try {
      const user = await fetchMe();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearAccessToken();
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      const token = localStorage.getItem('fitness_store_token');
      if (token) {
        try {
          // Try to load user directly with existing token first
          await loadMe();
        } catch {
          // If direct load fails, try to refresh the token
          const refreshed = await refreshSession();
          if (!refreshed) {
            clearAccessToken();
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      if (mounted) {
        setAuthLoading(false);
      }
    };
    boot();
    return () => {
      mounted = false;
    };
  }, [loadMe, refreshSession]);

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated,
    authLoading,
    login,
    signup,
    googleLogin,
    logout,
    refreshSession,
  }), [currentUser, isAuthenticated, authLoading, login, signup, googleLogin, logout, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
