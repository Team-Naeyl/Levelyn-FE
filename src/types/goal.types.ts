export interface GoalDTO {
  id: number;
  userId: number;
  content: string;
  since: string;
  until: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCurrentGoalResponse {
  result: GoalDTO | null;
}
