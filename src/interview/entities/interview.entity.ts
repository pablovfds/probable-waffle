import { QuestionResponse, Survey, User, Question } from '@prisma/client';

export class Interview {
  id: number;
  status: InterviewStatus;
  user_id: number;
  survey_id: number;

  longitude: number;
  latitude: number;
  place_id: number;
  quesitons: Question[];
  created_at: Date;
  updated_at: Date;
  collected_at: Date;
  duration: number;
  user: User;
  survey: Survey;
  place: any;
  responses: QuestionResponse[];
}

export enum InterviewStatus {
  DRAFT = -1,
  COLLECTED = 0,
  AUDITED = 1,
  APPROVED = 2,
  REJECTED = 3,
}
