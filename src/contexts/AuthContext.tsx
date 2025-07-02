import { createContext, useState, useContext, type PropsWithChildren } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  // 토큰 관리는 api.ts에서 처리하고 AuthContext에서는 로그인 상태만 관리
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const login = (token: string) => {
    console.log('로그인 함수 호출되었으나 개발 환경에서는 항상 로그인 된 상태로 관리함니다', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log('로그아웃 함수 호출되었으나 개발 환경에서는 항상 로그인 된 상태로 관리함니다');
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    accessToken: null,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }
  return context;
};
