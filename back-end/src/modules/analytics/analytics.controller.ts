import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * 获取高频错题
   */
  @Get('high-frequency-wrong')
  async getHighFrequencyWrongQuestions(@Query('limit') limit: string = '50') {
    return this.analyticsService.getHighFrequencyWrongQuestions(parseInt(limit));
  }

  /**
   * 获取用户错题分析
   */
  @Get('user-wrong-analysis')
  async getUserWrongAnalysis(@Request() req) {
    return this.analyticsService.getUserWrongQuestionAnalysis(req.user.id);
  }

  /**
   * 获取错因分析
   */
  @Get('wrong-reasons')
  async getWrongReasons(
    @Request() req,
    @Query('questionId') questionId: string
  ) {
    return this.analyticsService.analyzeWrongReasons(
      req.user.id,
      parseInt(questionId)
    );
  }

  /**
   * 获取今日复习题目
   */
  @Get('today-review')
  async getTodayReview(@Request() req) {
    return this.analyticsService.getTodayReviewQuestions(req.user.id);
  }

  /**
   * 获取学习统计
   */
  @Get('study-stats')
  async getStudyStats(
    @Request() req,
    @Query('days') days: string = '30'
  ) {
    return this.analyticsService.getStudyStatistics(
      req.user.id,
      parseInt(days)
    );
  }
}