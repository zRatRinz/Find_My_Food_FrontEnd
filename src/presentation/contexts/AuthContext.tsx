"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '@/infrastructure/auth/AuthRepository';
import { User } from '@/domain/user/User';
import { APP_CONFIG } from '@/infrastructure/common/config';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  getProfileImage: (userData: any) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authApi = new AuthRepository();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
      const userInfo = localStorage.getItem(APP_CONFIG.auth.userKey);

      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (e) {
          console.error('Failed to parse user info:', e);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  const getProfileImage = (userData: any) => {
    if (userData?.image_url) return userData.image_url;
    const seed = encodeURIComponent(userData?.username || 'guest');
    if (userData?.gender === 'Male') return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=male&mouth=smile`;
    if (userData?.gender === 'Female') return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=female&mouth=smile`;
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout, getProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
