import { Controller, Get, Param } from '@nestjs/common';
import { QuotasService } from './quotas.service';
// import { CreateQuotaDto } from './dto/create-quota.dto';
// import { UpdateQuotaDto } from './dto/update-quota.dto';

@Controller('quotas')
export class QuotasController {
  constructor(private readonly quotasService: QuotasService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotasService.findOne(+id);
  }

  @Get('survey/:id')
  findBySurveyId(@Param('id') id: string) {
    return this.quotasService.findBySurveyId(+id);
  }

  @Get('survey/:surveyId/place/:placeId')
  findOneBySurveyIdAndPlaceId(@Param('surveyId') surveyId: string, @Param('placeId') placeId: string) {
    return this.quotasService.findOneBySurveyIdAndPlaceId(+surveyId, +placeId);
  }
}
