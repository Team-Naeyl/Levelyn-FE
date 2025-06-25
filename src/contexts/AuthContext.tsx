import { createContext, useState, useContext, useEffect, type PropsWithChildren } from 'react';
import axios from 'axios';
import { renewToken, signOut as performSignOut } from '../services/auth';
import api from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await renewToken();
        if (response.accessToken) {
          setAccessToken(response.accessToken);
          setIsLoggedIn(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          console.error('토큰 갱신 중 서버 오류 발생. 백엔드 로그를 확인하세요.', error);
        } else {
          console.info('로그인 정보가 없거나 세션이 만료되었습니다.');
        }
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await performSignOut();
    } catch (error) {
      console.error('로그아웃 처리 중 오류가 발생했습니다.', error);
    } finally {
      setAccessToken(null);
      setIsLoggedIn(false);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const value = { isLoggedIn, accessToken, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }
  return context;
};
