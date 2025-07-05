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

export interface PostTodoQuery {
  description: string;
  date: string;
  isSub?: boolean;
  period?: {
    unit: 'years' | 'months' | 'weeks' | 'days';
    amount: number;
  };
}

export interface PatchTodoQuery {
  description?: string;
  date?: string;
  isSub?: boolean;
  period?: {
    unit: 'years' | 'months' | 'weeks' | 'days';
    amount: number;
  };
}

export interface EditTodoDTO {
  id: string;
  text: string;
  checked: boolean;
  category: '일반' | '목표';
}
