import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SurveysService } from 'src/surveys/surveys.service';
import { PlaceService } from 'src/place/place.service';
import { QuestionResponseService } from 'src/question-response/question-response.service';

@Module({
  controllers: [InterviewController],
  providers: [
    InterviewService,
    PrismaService,
    UsersService,
    SurveysService,
    PlaceService,
    QuestionResponseService,
  ],
})
export class InterviewModule {}
