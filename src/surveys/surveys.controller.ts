import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { PrismaService } from 'src/database/prisma.service';

@Controller('surveys')
export class SurveysController {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(createSurveyDto);
  }

  @Get()
  findAll() {
    return this.surveysService.findAll();
  }

  @Get('/:id/sections')
  findAllSurveySections(@Param('id') id: string) {
    return this.surveysService.findAllSurveySections(+id);
  }

  @Get('/user/:userCode')
  findAllByUserCode(@Param('userCode') userCode: string) {
    return this.surveysService.findAllByUserCode(userCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveysService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
  //   // return this.surveysService.update(+id, updateSurveyDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveysService.remove(+id);
  }
}
