import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem('basera_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem('basera_token') || null);
  const [hydrating, setHydrating] = useState(Boolean(localStorage.getItem('basera_token')));
  const hydratedRef = useRef(false);

  // Re-validate token on mount for persistent auth state
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const t = localStorage.getItem('basera_token');
    if (!t) { setHydrating(false); return; }

    let cancelled = false;
    api.get('/auth/me')
      .then(({ data }) => {
        if (cancelled) return;
        const fresh = data.user || data;
        if (fresh) {
          setUser(fresh);
          localStorage.setItem('basera_user', JSON.stringify(fresh));
        }
      })
      .catch((err) => {
        // 401 → clear; network errors → keep cached user so the UI stays signed in
        if (err?.response?.status === 401) {
          localStorage.removeItem('basera_token');
          localStorage.removeItem('basera_user');
          setUser(null);
          setToken(null);
        }
      })
      .finally(() => { if (!cancelled) setHydrating(false); });

    return () => { cancelled = true; };
  }, []);

  const persist = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('basera_user', JSON.stringify(userData));
    localStorage.setItem('basera_token', tokenStr);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.user, data.token);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data.user, data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('basera_user');
    localStorage.removeItem('basera_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, hydrating, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
