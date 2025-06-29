import { createContext, useState, useContext, useEffect, type PropsWithChildren } from 'react';
import axios from 'axios';
import { renewToken, signOut as performSignOut } from '../services/auth';
import api from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string) => {
    setAccessToken(token);
    setIsLoggedIn(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearAuthState = () => {
    setAccessToken(null);
    setIsLoggedIn(false);
    delete api.defaults.headers.common['Authorization'];
  };

  const logout = async () => {
    try {
      await performSignOut();
    } catch (error) {
      console.error('로그아웃 처리 중 오류가 발생했습니다.', error);
    } finally {
      clearAuthState();
    }
  };

  const value = { isLoggedIn, accessToken, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }
  return context;
};
