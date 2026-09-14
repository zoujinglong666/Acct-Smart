import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudyService } from './study.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('study')
@UseGuards(JwtAuthGuard)
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  /**
   * 获取学习记录
   */
  @Get('records')
  async getStudyRecords(@GetUser() user: User) {
    return this.studyService.getStudyRecords(user.id);
  }

  /**
   * 获取错题本
   */
  @Get('wrong-questions')
  async getWrongQuestions(@GetUser() user: User) {
    return this.studyService.getWrongQuestions(user.id);
  }

  /**
   * 添加错题
   */
  @Post('wrong-question')
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
  async deleteWrongQuestion(
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    return this.studyService.deleteWrongQuestion(user.id, parseInt(id));
  }

  /**
   * 获取今日学习状态
   */
  @Get('today-status')
  async getTodayStatus(@GetUser() user: User) {
    return this.studyService.getTodayStatus(user.id);
  }
}
