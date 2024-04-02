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
        id: +createInterviewDto.id,
      },
    });
    const inserts = [];
    const isMultiSelectOrCheckbox =
      question.type === 'multiselect' ||
      question.type === 'checkbox' ||
      question.type === 'topic' ||
      question.type === 'sorted';
    if (isMultiSelectOrCheckbox && Array.isArray(createInterviewDto.answer)) {
      const alternatives = createInterviewDto.answer; // { id: 1, sequence: 1 }

      alternatives.forEach((alt) => {
        inserts.push(
          this.prisma.questionResponse.create({
            data: {
              sequence: alt.sequence,
              user: { connect: { id: user.id } },
              alternatives: {
                connect: { id: alt.id },
              },
              question: { connect: { id: question.id } },
              interview: { connect: { id: createInterviewDto.interviewId } },
            },
          }),
        );
      });
    } else {
      if (typeof createInterviewDto.answer !== 'string') {
        console.log('Answer is not a string');
        return;
      }
      inserts.push(
        this.prisma.questionResponse.create({
          data: {
            value: createInterviewDto.answer,
            user: { connect: { id: user.id } },
            question: { connect: { id: question.id } },
            interview: { connect: { id: createInterviewDto.interviewId } },
          },
        }),
      );
    }
    await this.prisma.$transaction(inserts);
  }
}
