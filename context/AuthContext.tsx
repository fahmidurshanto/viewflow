'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  agencyName?: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  updateUser: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session by verifying HttpOnly cookie with /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await api.getCurrentUser();
        if (isMounted && res.user) {
          setUser({
            id: res.user._id || res.user.id,
            name: res.user.name,
            email: res.user.email,
            agencyName: res.user.agencyName,
            phone: res.user.phone,
            role: res.user.role
          });
          return;
        }
      } catch (err) {
        // Unauthenticated session
      }

      if (isMounted) {
        setUser(null);
      }
    };

    checkSession().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<AuthUser>) => {
    if (!user) return;
    setUser({ ...user, ...updatedFields });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
