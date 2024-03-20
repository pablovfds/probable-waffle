import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PlaceService } from 'src/place/place.service';
import { InterviewStatus } from 'src/interview/entities/interview.entity';

@Injectable()
export class SurveysService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly placeService: PlaceService,
  ) {}
  async create(createSurveyDto: CreateSurveyDto) {
    const place = await this.placeService.findOne(createSurveyDto.placeId);
    console.log(`place: ${JSON.stringify(place)}`);
    const user = await this.usersService.findUserByCode(createSurveyDto.userCode);
    console.log(`user: ${JSON.stringify(user)}`);

    const survey = await this.prisma.survey.create({
      data: {
        name: createSurveyDto.name,
        interviewDone: createSurveyDto.interviewDone,
        interviewTotal: createSurveyDto.interviewTotal,
        goalTotal: createSurveyDto.goalTotal,
        goalCount: createSurveyDto.goalCount,
        withAudio: createSurveyDto.withAudio,
        minDistance: createSurveyDto.minDistance,
        initialDate: new Date(createSurveyDto.initialDate),
        finalDate: new Date(createSurveyDto.finalDate),
        place: {
          connect: {
            id: createSurveyDto.placeId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await this.usersService.addSurveyToUser(user.code, survey.id);

    return survey;
  }

  async findAll() {
    const surveys = await this.prisma.survey.findMany({
      select: {
        id: true,
        name: true,
        initialDate: true,
        finalDate: true,
        interviewDone: true,
        interviewTotal: true,
        goalTotal: true,
        goalCount: true,
        withAudio: true,
        minDistance: true,
        deleted: true,
        place: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return surveys;
  }

  async findAllByUserCode(userCode: string) {
    const user = await this.usersService.findUserByCode(userCode);
    const surveys = await this.prisma.survey.findMany({
      where: {
        userId: user.id,
      },
      include: {
        place: true,
        interviews: true,
      },
    });

    surveys.forEach((survey) => {
      survey.interviewDone = survey.interviews.filter((interview) => interview.status !== InterviewStatus.DRAFT).length;
    });

    return surveys;
  }

  async findOne(id: number) {
    const survey = await this.prisma.survey.findUnique({
      where: {
        id,
      },
      include: {
        place: true,
        user: true,
      },
    });

    if (!survey) {
      throw new Error('Survey not found');
    }

    return survey;
  }

  async findAllSurveySections(id: number) {
    const sections = await this.prisma.section.findMany({
      where: {
        surveyId: id,
      },
      include: {
        questions: {
          include: {
            gridQuestions: {
              include: {
                alternatives: {
                  include: {
                    alternative: true,
                  },
                },
              },
            },
            alternatives: {
              include: {
                alternative: true,
              },
            },
          },
        },
      },
    });

    const result = sections.map((section) => {
      return {
        ...section,
        questions: section.questions.map((question) => {
          return {
            ...question,
            gridQuestions: question.gridQuestions.map((gridQuestion) => {
              return {
                ...gridQuestion,
                alternatives: gridQuestion.alternatives.map((alternative) => {
                  return alternative.alternative;
                }),
              };
            }),
            alternatives: question.alternatives.map((alternative) => {
              return alternative.alternative;
            }),
          };
        }),
      };
    });
    return result;
  }

  // update(id: number, updateSurveyDto: UpdateSurveyDto) {
  //   return `This action updates a #${id} survey`;
  // }

  addInterviewDone(id: number) {
    return this.prisma.survey.update({
      where: {
        id,
      },
      data: {
        interviewDone: {
          increment: 1,
        },
      },
    });
  }

  remove(id: number) {
    this.prisma.survey.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }
}
