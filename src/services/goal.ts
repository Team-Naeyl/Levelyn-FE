import api from './api';
import type { GoalDTO, GetCurrentGoalResponse } from '../types/goal.types';

export const getCurrentGoal = async (): Promise<GoalDTO | null> => {
  const response = await api.get<GetCurrentGoalResponse>('/api/goals');
  return response.data.result;
};
