import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('daily')
  async getDailyQuestions(@GetUser() user: User) {
    return this.questionService.getDailyQuestions(user.id);
  }

  @Get('wrong')
  async getWrongQuestions(@GetUser() user: User) {
    return this.questionService.getWrongQuestions(user.id);
  }

  @Get('high-frequency')
  async getHighFrequencyWrongQuestions(@GetUser() user: User) {
    return this.questionService.getHighFrequencyWrongQuestions(user.id);
  }

  @Get('by-knowledge-point/:knowledgePointId')
  async getQuestionsByKnowledgePoint(@Param('knowledgePointId') knowledgePointId: string) {
    return this.questionService.getQuestionsByKnowledgePoint(knowledgePointId);
  }

  @Post('answer')
  async submitAnswer(
    @GetUser() user: User,
    @Body() answerData: {
      questionId: string;
      userAnswer: string;
      isCorrect: boolean;
      timeSpent: number;
    }
  ) {
    return this.questionService.submitAnswer(
      user.id,
      answerData.questionId,
      answerData.userAnswer,
      answerData.isCorrect,
      answerData.timeSpent
    );
  }

  @Get('analysis/:questionId')
  async getQuestionAnalysis(@Param('questionId') questionId: string) {
    return this.questionService.getQuestionAnalysis(questionId);
  }

  @Get('search')
  async searchQuestions(
    @Query('keyword') keyword: string,
    @Query('difficulty') difficulty?: string,
    @Query('knowledgePointId') knowledgePointId?: string
  ) {
    return this.questionService.searchQuestions(keyword, difficulty, knowledgePointId);
  }
}