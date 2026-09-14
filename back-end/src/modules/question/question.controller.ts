import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * 获取每日题目
   */
  @Get('daily')
  async getDailyQuestions(@GetUser() user: User) {
    return this.questionService.getDailyQuestions(user.id);
  }

  /**
   * 根据知识点获取题目（章节练习）
   */
  @Get('by-knowledge-point/:knowledgePointId')
  async getQuestionsByKnowledgePoint(@Param('knowledgePointId') knowledgePointId: string) {
    return this.questionService.getQuestionsByKnowledgePoint(knowledgePointId);
  }

  /**
   * 提交答案
   */
  @Post('answer')
  async submitAnswer(
    @GetUser() user: User,
    @Body() answerData: {
      questionId: string;
      userAnswer: string;
      timeSpent: number;
    }
  ) {
    return this.questionService.submitAnswer(
      user.id,
      answerData.questionId,
      answerData.userAnswer,
      answerData.timeSpent
    );
  }

  /**
   * 获取题目解析
   */
  @Get('analysis/:questionId')
  async getQuestionAnalysis(@Param('questionId') questionId: string) {
    return this.questionService.getQuestionAnalysis(questionId);
  }

  /**
   * 搜索题目
   */
  @Get('search')
  async searchQuestions(
    @Query('keyword') keyword: string,
    @Query('difficulty') difficulty?: string,
    @Query('knowledgePointId') knowledgePointId?: string
  ) {
    return this.questionService.searchQuestions(keyword, difficulty, knowledgePointId);
  }
}
