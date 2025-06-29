import api from './api';

interface RenewResponse {
  accessToken: string;
}

interface KakaoLoginResponse {
  accessToken: string;
}

export const signOut = async (): Promise<void> => {
  await api.get('/api/auth/sign-out');
};

export const renewToken = async (): Promise<RenewResponse> => {
  const response = await api.get<RenewResponse>('/api/auth/renew');
  return response.data;
};

export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const response = await api.get<KakaoLoginResponse>('/api/auth/sign-in', {
    params: {
      code,
    },
  });
  return response.data;
};
