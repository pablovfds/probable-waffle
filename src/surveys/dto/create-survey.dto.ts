export class CreateSurveyDto {
  name: string;
  initialDate: Date;
  finalDate: Date;
  interviewDone: number;
  interviewTotal: number;
  goalTotal: number;
  goalCount: number;
  withAudio: boolean;
  minDistance: number;
  deleted: boolean;
  placeId: number;
  userCode: string;
}
