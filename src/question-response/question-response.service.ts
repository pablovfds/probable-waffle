import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateQuestionResponseDto } from './dto/create-question-response.dto';

@Injectable()
export class QuestionResponseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInterviewDto: CreateQuestionResponseDto) {
    console.log(`Creating question response...`);
    console.log(createInterviewDto);

    const user = await this.prisma.user.findUnique({
      where: {
        code: createInterviewDto.userCode,
      },
    });
    const question = await this.prisma.question.findUnique({
      where: {
        id: +createInterviewDto.questionId,
      },
    });

    const isMultiSelectOrCheckbox =
      question.type === 'multiselect' ||
      question.type === 'checkbox' ||
      question.type === 'topic';

    let alternatives = [];
    let value = null;
    if (isMultiSelectOrCheckbox) {
      alternatives = createInterviewDto.value.split(',');
    } else {
      value = createInterviewDto.value;
    }

    return await this.prisma.questionResponse.create({
      data: {
        value: value,
        user: { connect: { id: user.id } },
        question: { connect: { id: question.id } },
        alternatives: {
          connect: alternatives.map((alt) => ({ id: +alt })),
        },
        interview: { connect: { id: createInterviewDto.interviewId } },
      },
    });
  }
}
