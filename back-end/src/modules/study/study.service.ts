import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StudyRecord } from './entities/study-record.entity';
import { WrongQuestion } from './entities/wrong-question.entity';
import { BaseResponse } from '../../common/dto/base-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
    @InjectRepository(WrongQuestion)
    private wrongQuestionRepository: Repository<WrongQuestion>,
  ) {}

  /**
   * 获取学习记录（答题流水，最近 N 条）
   */
  async getStudyRecords(userId: number, limit: number = 30) {
    try {
      const records = await this.studyRecordRepository.find({
        where: { userId },
        relations: ['question'],
        order: { createdAt: 'DESC' },
        take: limit
      });

      return BaseResponse.success(records, '获取学习记录成功');
    } catch (error) {
      console.error('获取学习记录失败:', error);
      throw BusinessException.systemError('获取学习记录失败');
    }
  }

  /**
   * 获取错题本（含题目信息）
   */
  async getWrongQuestions(userId: number) {
    try {
      const wrongQuestions = await this.wrongQuestionRepository.find({
        where: { userId },
        relations: ['question'],
        order: { createdAt: 'DESC' }
      });

      return BaseResponse.success(wrongQuestions, '获取错题本成功');
    } catch (error) {
      console.error('获取错题本失败:', error);
      throw BusinessException.systemError('获取错题本失败');
    }
  }

  /**
   * 添加错题（已存在则错误次数 +1）
   */
  async addWrongQuestion(userId: number, wrongQuestionData: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }) {
    try {
      const questionId = parseInt(wrongQuestionData.questionId);
      // 检查是否已存在相同题目
      const existingWrong = await this.wrongQuestionRepository.findOne({
        where: {
          userId,
          questionId
        }
      });

      if (existingWrong) {
        // 再次答错：次数 +1，若曾被标记掌握则重置
        existingWrong.wrongCount += 1;
        existingWrong.userAnswer = wrongQuestionData.userAnswer;
        existingWrong.lastWrongTime = new Date();
        if (existingWrong.isSolved || existingWrong.isMastered) {
          existingWrong.isSolved = false;
          existingWrong.isMastered = false;
        }
        const updated = await this.wrongQuestionRepository.save(existingWrong);
        return BaseResponse.success(updated, '错题记录已更新');
      }

      // 创建新的错题记录
      const wrongQuestion = this.wrongQuestionRepository.create({
        userId,
        questionId,
        userAnswer: wrongQuestionData.userAnswer,
        correctAnswer: wrongQuestionData.correctAnswer,
        explanation: wrongQuestionData.explanation,
        wrongCount: 1,
        isSolved: false
      });

      const saved = await this.wrongQuestionRepository.save(wrongQuestion);
      return BaseResponse.success(saved, '错题添加成功');
    } catch (error) {
      console.error('添加错题失败:', error);
      throw BusinessException.systemError('添加错题失败');
    }
  }

  /**
   * 标记错题已掌握
   */
  async markWrongQuestionMastered(userId: number, wrongQuestionId: number) {
    try {
      const wrongQuestion = await this.wrongQuestionRepository.findOne({
        where: { id: wrongQuestionId, userId }
      });

      if (!wrongQuestion) {
        throw BusinessException.notFoundError('错题记录不存在');
      }

      wrongQuestion.isSolved = true;
      wrongQuestion.isMastered = true;
      wrongQuestion.solvedTime = new Date();

      const updated = await this.wrongQuestionRepository.save(wrongQuestion);
      return BaseResponse.success(updated, '标记成功');
    } catch (error) {
      console.error('标记错题失败:', error);
      if (error instanceof BusinessException) {
        throw error;
      }
      throw BusinessException.systemError('标记错题失败');
    }
  }

  /**
   * 删除错题
   */
  async deleteWrongQuestion(userId: number, wrongQuestionId: number) {
    try {
      const result = await this.wrongQuestionRepository.delete({
        id: wrongQuestionId,
        userId
      });

      if (result.affected === 0) {
        throw BusinessException.notFoundError('错题记录不存在');
      }

      return BaseResponse.success(null, '删除成功');
    } catch (error) {
      console.error('删除错题失败:', error);
      if (error instanceof BusinessException) {
        throw error;
      }
      throw BusinessException.systemError('删除错题失败');
    }
  }

  /**
   * 获取今日学习状态（按当日答题流水聚合）
   */
  async getTodayStatus(userId: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayRecords = await this.studyRecordRepository.find({
        where: {
          userId,
          createdAt: Between(today, tomorrow)
        }
      });

      const total = todayRecords.length;
      const correct = todayRecords.filter(r => r.isCorrect).length;
      const totalTime = todayRecords.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

      const status = {
        hasStudiedToday: total > 0,
        todayQuestions: total,
        todayCorrect: correct,
        todayAccuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        todayStudyTime: Math.round(totalTime / 60)
      };

      return BaseResponse.success(status, '获取今日状态成功');
    } catch (error) {
      console.error('获取今日状态失败:', error);
      throw BusinessException.systemError('获取今日状态失败');
    }
  }
}
