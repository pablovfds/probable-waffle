import { Alternative } from '@prisma/client';

export class QuestionResponse {
  id: number;
  value: string;
  alternatives: Alternative[];
  questionId: number;
  interviewId: number;
  userId: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
