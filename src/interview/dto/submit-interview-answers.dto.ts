import { CreateQuestionResponseDto } from 'src/question-response/dto/create-question-response.dto';

export class SubmitInterviewAnswerDto {
  responses: CreateQuestionResponseDto[];
  duration: number;
  audioUrl?: string;
}
