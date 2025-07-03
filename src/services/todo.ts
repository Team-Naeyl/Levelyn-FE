import api from './api';
import type { TodoDTO, GetDailyTodoListQuery, GetDailyTodoListResponse, PostTodoQuery } from '../types/todo.types';

export const getDailyTodoList = async (query: GetDailyTodoListQuery): Promise<TodoDTO[]> => {
  const response = await api.get<GetDailyTodoListResponse>('/api/to-do', {
    params: query,
  });
  return response.data.results;
};

export const fulfillTodo = async (id: number): Promise<void> => {
  await api.put(`/api/to-do/${id}`);
};

export const createTodo = async (payload: PostTodoQuery): Promise<void> => {
  await api.post('/api/to-do', payload);
};

export const updateTodo = async (id: number, payload: PostTodoQuery): Promise<void> => {
  await api.put(`/api/to-do/${id}`, payload);
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/api/to-do/${id}`);
};
