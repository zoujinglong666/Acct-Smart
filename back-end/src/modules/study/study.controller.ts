import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StudyService } from './study.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('学习管理')
@Controller('study')
@UseGuards(JwtAuthGuard)
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  /**
   * 获取学习记录
   */
  @Get('records')
  @ApiOperation({ summary: '获取学习记录' })
  async getStudyRecords(@GetUser() user: User) {
    return this.studyService.getStudyRecords(user.id);
  }

  /**
   * 创建学习记录
   */
  @Post('record')
  @ApiOperation({ summary: '创建学习记录' })
  async createStudyRecord(
    @GetUser() user: User,
    @Body() recordData: {
      studyTime: number;
      completedQuestions: number;
      accuracy: number;
      subjects: string[];
    }
  ) {
    return this.studyService.createStudyRecord(user.id, recordData);
  }

  /**
   * 获取错题本
   */
  @Get('wrong-questions')
  @ApiOperation({ summary: '获取错题本' })
  async getWrongQuestions(@GetUser() user: User) {
    return this.studyService.getWrongQuestions(user.id);
  }

  /**
   * 添加错题
   */
  @Post('wrong-question')
  @ApiOperation({ summary: '添加错题' })
  async addWrongQuestion(
    @GetUser() user: User,
    @Body() wrongQuestionData: {
      questionId: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }
  ) {
    return this.studyService.addWrongQuestion(user.id, wrongQuestionData);
  }

  /**
   * 标记错题已掌握
   */
  @Patch('wrong-question/:id/mastered')
  @ApiOperation({ summary: '标记错题已掌握' })
  async markWrongQuestionMastered(
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    return this.studyService.markWrongQuestionMastered(user.id, parseInt(id));
  }

  /**
   * 删除错题
   */
  @Delete('wrong-question/:id')
  @ApiOperation({ summary: '删除错题' })
  async deleteWrongQuestion(
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    return this.studyService.deleteWrongQuestion(user.id, parseInt(id));
  }

  /**
   * 获取学习计划
   */
  @Get('plans')
  @ApiOperation({ summary: '获取学习计划' })
  async getStudyPlans(@GetUser() user: User) {
    return this.studyService.getStudyPlans(user.id);
  }

  /**
   * 创建学习计划
   */
  @Post('plan')
  @ApiOperation({ summary: '创建学习计划' })
  async createStudyPlan(
    @GetUser() user: User,
    @Body() planData: {
      name: string;
      description: string;
      targetDays: number;
      dailyGoal: number;
    }
  ) {
    return this.studyService.createStudyPlan(user.id, planData);
  }

  /**
   * 更新学习计划
   */
  @Patch('plan/:id')
  @ApiOperation({ summary: '更新学习计划' })
  async updateStudyPlan(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() planData: any
  ) {
    return this.studyService.updateStudyPlan(user.id, parseInt(id), planData);
  }

  /**
   * 完成学习计划
   */
  @Post('plan/:id/complete')
  @ApiOperation({ summary: '完成学习计划' })
  async completeStudyPlan(
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    return this.studyService.completeStudyPlan(user.id, parseInt(id));
  }

  /**
   * 获取今日学习状态
   */
  @Get('today-status')
  @ApiOperation({ summary: '获取今日学习状态' })
  async getTodayStatus(@GetUser() user: User) {
    return this.studyService.getTodayStatus(user.id);
  }

  /**
   * 保存每日学习记录
   */
  @Post('daily-record')
  @ApiOperation({ summary: '保存每日学习记录' })
  async saveDailyRecord(
    @GetUser() user: User,
    @Body() recordData: {
      studyTime: number;
      completedQuestions: number;
      accuracy: number;
    }
  ) {
    return this.studyService.saveDailyRecord(user.id, recordData);
  }
}