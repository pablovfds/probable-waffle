import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitInterviewAnswerDto } from './dto/submit-interview-answers.dto';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewService.create(createInterviewDto);
  }

  @Get()
  findAll() {
    return this.interviewService.findAll();
  }

  @Get('/survey/:id')
  findAllBySurveyId(@Param('id') id: number) {
    return this.interviewService.findAllBySurveyId(+id);
  }

  @Get('/activated/survey/:id')
  findAllActivatedBySurveyId(@Param('id') id: number, @Query('status') filter: string[]) {
    return this.interviewService.findAllActivatedBySurveyId(+id, filter.map(Number));
  }

  @Post('/:id/submit-answers')
  submitAnswer(@Param('id') id: string, @Body() dto: SubmitInterviewAnswerDto) {
    return this.interviewService.submitAnswers(+id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.interviewService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(+id);
  }
}
