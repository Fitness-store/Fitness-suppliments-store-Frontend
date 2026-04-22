import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminAuthContext } from './adminAuthContextObject';
import api from '../services/api';

const ADMIN_TOKEN_KEY = 'fitness_store_admin_token';

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const setAdminToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  }, []);

  const getAdminToken = useCallback(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }, []);

  const adminLogin = useCallback(async (payload) => {
    const response = await api.post('/fs/admin/auth/login', payload);
    const data = response.data;
    if (data?.accessToken) {
      setAdminToken(data.accessToken);
    }
    if (data?.admin) {
      setAdminUser(data.admin);
      setIsAdminAuthenticated(true);
    }
    return data;
  }, [setAdminToken]);

  const adminLogout = useCallback(async () => {
    try {
      await api.post('/fs/admin/auth/logout');
    } finally {
      setAdminToken(null);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
    }
  }, [setAdminToken]);

  const adminRefresh = useCallback(async () => {
    try {
      const response = await api.post('/fs/admin/auth/refresh');
      const data = response.data;
      if (data?.accessToken) {
        setAdminToken(data.accessToken);
      }
      if (data?.admin) {
        setAdminUser(data.admin);
        setIsAdminAuthenticated(true);
      }
      return true;
    } catch {
      setAdminToken(null);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      return false;
    }
  }, [setAdminToken]);

  const loadAdminMe = useCallback(async () => {
    try {
      const token = getAdminToken();
      if (!token) return false;
      const response = await api.get('/fs/admin/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminUser(response.data);
      setIsAdminAuthenticated(true);
      return true;
    } catch {
      setAdminToken(null);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      return false;
    }
  }, [getAdminToken, setAdminToken]);

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      const token = getAdminToken();
      if (token) {
        await loadAdminMe();
      }
      if (mounted) setAdminLoading(false);
    };
    boot();
    return () => { mounted = false; };
  }, [getAdminToken, loadAdminMe]);

  const value = useMemo(() => ({
    adminUser,
    isAdminAuthenticated,
    adminLoading,
    adminLogin,
    adminLogout,
    adminRefresh,
    getAdminToken,
  }), [adminUser, isAdminAuthenticated, adminLoading, adminLogin, adminLogout, adminRefresh, getAdminToken]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
