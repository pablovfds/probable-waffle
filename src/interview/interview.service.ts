import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { PrismaService } from 'src/database/prisma.service';
import { SurveysService } from 'src/surveys/surveys.service';
import { UsersService } from 'src/users/users.service';
import { InterviewStatus } from './entities/interview.entity';
import { PlaceService } from 'src/place/place.service';
import { SubmitInterviewAnswerDto } from './dto/submit-interview-answers.dto';
import { QuestionResponseService } from 'src/question-response/question-response.service';

@Injectable()
export class InterviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly surveysService: SurveysService,
    private readonly placesService: PlaceService,
    private readonly questionResponseService: QuestionResponseService,
  ) {}

  async create(createInterviewDto: CreateInterviewDto) {
    console.log(`Creating interview...`);
    const { user_code, survey_id, place_id } = createInterviewDto;
    const user = await this.usersService.findUserByCode(user_code);
    const survey = await this.surveysService.findOne(survey_id);
    // const place = await this.placesService.findOne(place_id);

    console.log(createInterviewDto);

    const interviewCreated = await this.prisma.interview.create({
      data: {
        status: InterviewStatus.DRAFT,
        user: { connect: { id: user.id } },
        survey: { connect: { id: survey.id } },
        longitude: createInterviewDto.longitude,
        latitude: createInterviewDto.latitude,
        place: { connect: { id: place_id } },
      },
      include: {
        user: true,
        survey: true,
      },
    });

    console.log(`Interview created:`, interviewCreated);
    return interviewCreated;
  }

  async submitAnswers(interviewId: number, dto: SubmitInterviewAnswerDto) {
    console.log(`Storing responses...`, interviewId);
    const interview = await this.findOne(interviewId);
    if (!interview) {
      throw new Error('Interview not found');
    }

    for (const response of dto.responses) {
      // Create question response
      console.log(`Creating question response...`, response);

      await this.questionResponseService.create({
        interviewId,
        questionId: response.questionId,
        value: response.value,
        userCode: response.userCode,
      });
    }

    // Update interview status and duration
    const resp = await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: InterviewStatus.COLLECTED,
        duration: dto.duration,
        collected_at: new Date(),
        audioUrl: dto.audioUrl,
      },
    });

    console.log(`Interview updated:`, interview);

    const survey = await this.surveysService.addInterviewDone(interview.surveyId);
    console.log(`Survey updated:`, survey);

    return resp;
  }

  async findAll() {
    console.log(`Finding all interviews...`);
    return await this.prisma.interview.findMany({
      include: {
        user: true,
        survey: true,
      },
    });
  }

  async findAllBySurveyId(surveyId: number) {
    console.log(`Finding all interviews by survey...`, surveyId);

    const where = {
      surveyId: surveyId,
      OR: [
        {
          status: InterviewStatus.COLLECTED,
        },
        {
          status: InterviewStatus.AUDITED,
        },
        {
          status: InterviewStatus.APPROVED,
        },
        {
          status: InterviewStatus.REJECTED,
        },
      ],
    };

    console.log(`Where:`, where);

    return await this.prisma.interview.findMany({
      where: where,
      include: {
        user: true,
        survey: true,
      },
    });
  }

  async findAllActivatedBySurveyId(surveyId: number, filter: number[] = []) {
    console.log(`Finding all interviews not deleted by survey...`, surveyId);

    const where = {
      surveyId: surveyId,
      deleted: false,
      status: {
        in: filter,
      },
    };

    console.log(`Where:`, where);

    return await this.prisma.interview.findMany({
      where: where,
      include: {
        user: true,
        survey: true,
      },
    });
  }

  async findOne(id: number) {
    const interview = await this.prisma.interview.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        survey: true,
      },
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    return interview;
  }

  async remove(id: number) {
    console.log(`Removing interview...`, id);
    const interview = await this.findOne(id);

    if (!interview) {
      throw new Error('Interview not found');
    }

    return await this.prisma.interview.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
