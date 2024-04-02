export class CreateQuestionResponseDto {
  id: number;
  interviewId: number;
  gridQuestionId?: number;
  answer: string | AlternativeResponse[];
  userCode: string;
}

export class AlternativeResponse {
  id: number;
  sequence?: number;
}
