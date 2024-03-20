import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PlaceService } from 'src/place/place.service';

@Module({
  controllers: [SurveysController],
  providers: [SurveysService, PrismaService, UsersService, PlaceService],
  exports: [SurveysService],
})
export class SurveysModule {}
