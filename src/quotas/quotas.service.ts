import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

// import { CreateQuotaDto } from './dto/create-quota.dto';
// import { UpdateQuotaDto } from './dto/update-quota.dto';

@Injectable()
export class QuotasService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return `This action returns a #${id} quota`;
  }

  async findBySurveyId(surveyId: number) {
    console.log(`Finding quota by survey...`, surveyId);
    const quotas = await this.prisma.quota.findMany({
      where: {
        surveyId: surveyId,
      },
      include: {
        place: true,
        survey: true,
      },
    });
    return quotas;
  }

  async findOneBySurveyIdAndPlaceId(surveyId: number, placeId: number) {
    console.log(`Finding quota by survey and place...`, surveyId, placeId);

    const quota = await this.prisma.quota.findFirst({
      where: {
        surveyId: surveyId,
        placeId: placeId,
      },
      include: {
        place: true,
        survey: true,
      },
    });

    return quota;
  }
}
