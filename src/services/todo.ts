import api from './api';
import type { TodoDTO, GetDailyTodoListQuery, GetDailyTodoListResponse } from '../types/todo.types';

export const getDailyTodoList = async (query: GetDailyTodoListQuery): Promise<TodoDTO[]> => {
  const response = await api.get<GetDailyTodoListResponse>('/api/to-do', {
    params: query,
  });
  return response.data.results;
};

export const fulfillTodo = async (id: number): Promise<void> => {
  await api.put(`/api/to-do/${id}`);
};
