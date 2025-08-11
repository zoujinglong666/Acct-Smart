import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('exam')
@UseGuards(JwtAuthGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('papers')
  async getExamPapers() {
    return this.examService.getExamPapers();
  }

  @Post('generate')
  async generateExamPaper(
    @GetUser() user: User,
    @Body() examConfig: {
      type: string;
      questionCount: number;
      timeLimit: number;
      knowledgePointIds?: number[];
    }
  ) {
    return this.examService.generateExamPaper(user.id, examConfig);
  }

  @Post('submit')
  async submitExam(
    @GetUser() user: User,
    @Body() examData: {
      paperId: number;
      answers: any[];
      timeSpent: number;
    }
  ) {
    return this.examService.submitExam(user.id, examData.paperId, examData.answers, examData.timeSpent);
  }

  @Get('records')
  async getExamRecords(@GetUser() user: User) {
    return this.examService.getExamRecords(user.id);
  }

  @Get('analysis/:recordId')
  async getExamAnalysis(@Param('recordId') recordId: string) {
    return this.examService.getExamAnalysis(+recordId);
  }
}