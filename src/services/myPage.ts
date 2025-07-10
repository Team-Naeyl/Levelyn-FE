import api from './api';
import type { MyPageData } from '../types/myPage.types';

export const getMyPageData = async (): Promise<MyPageData> => {
  const response = await api.get<MyPageData>('/api/my-pages');
  return response.data;
};
