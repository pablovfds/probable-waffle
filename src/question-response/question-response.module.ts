import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { QuestionResponseService } from './question-response.service';

@Module({
  controllers: [],
  providers: [QuestionResponseService, PrismaService],
  exports: [QuestionResponseService],
})
export class QuestionResponseModule {}
