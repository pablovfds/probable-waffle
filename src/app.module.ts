import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SurveysModule } from './surveys/surveys.module';
import { PlaceModule } from './place/place.module';
import { InterviewModule } from './interview/interview.module';
import { QuestionResponseModule } from './question-response/question-response.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { QuotasModule } from './quotas/quotas.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SurveysModule,
    PlaceModule,
    InterviewModule,
    QuestionResponseModule,
    FileUploadModule,
    QuotasModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
