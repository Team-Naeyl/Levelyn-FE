export interface Period {
  unit: 'days' | 'weeks' | 'months' | 'years';
  amount: number;
}

export interface TodoDTO {
  id: number;
  userId: number;
  title?: string;
  description?: string;
  date: string;
  completed: boolean;
  isSub: boolean;
  period?: Period;
  createdAt: string;
  updatedAt: string;
}

export interface GetDailyTodoListQuery {
  date: string;
}

export interface GetDailyTodoListResponse {
  results: TodoDTO[];
}
