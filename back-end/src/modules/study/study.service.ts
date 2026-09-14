import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StudyRecord } from './entities/study-record.entity';
import { WrongQuestion } from './entities/wrong-question.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { BaseResponse } from '../../common/dto/base-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
    @InjectRepository(WrongQuestion)
    private wrongQuestionRepository: Repository<WrongQuestion>,
    @InjectRepository(StudyPlan)
    private studyPlanRepository: Repository<StudyPlan>,
  ) {}

  /**
   * 获取学习记录
   */
  async getStudyRecords(userId: number) {
    try {
      const records = await this.studyRecordRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 30
      });

      return BaseResponse.success(records, '获取学习记录成功');
    } catch (error) {
      console.error('获取学习记录失败:', error);
      throw BusinessException.systemError('获取学习记录失败');
    }
  }

  /**
   * 创建学习记录
   */
  async createStudyRecord(userId: number, recordData: any) {
    try {
      const record = this.studyRecordRepository.create({
        userId,
        studyTime: recordData.studyTime,
        completedQuestions: recordData.completedQuestions,
        accuracy: recordData.accuracy,
        studyDate: new Date(),
        type: recordData.type || 'practice'
      });

      const savedRecord = await this.studyRecordRepository.save(record);
      return BaseResponse.success(savedRecord, '学习记录创建成功');
    } catch (error) {
      console.error('创建学习记录失败:', error);
      throw BusinessException.systemError('创建学习记录失败');
    }
  }

  /**
   * 获取错题本
   */
  async getWrongQuestions(userId: number) {
    try {
      const wrongQuestions = await this.wrongQuestionRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      return BaseResponse.success(wrongQuestions, '获取错题本成功');
    } catch (error) {
      console.error('获取错题本失败:', error);
      throw BusinessException.systemError('获取错题本失败');
    }
  }

  /**
   * 添加错题
   */
  async addWrongQuestion(userId: number, wrongQuestionData: any) {
    try {
      // 检查是否已存在相同题目
      const existingWrong = await this.wrongQuestionRepository.findOne({
        where: { 
          userId, 
          questionId: wrongQuestionData.questionId 
        }
      });

      if (existingWrong) {
        // 更新错误次数
        existingWrong.wrongCount += 1;
        existingWrong.lastWrongTime = new Date();
        const updated = await this.wrongQuestionRepository.save(existingWrong);
        return BaseResponse.success(updated, '错题记录已更新');
      } else {
        // 创建新的错题记录
        const wrongQuestion = this.wrongQuestionRepository.create({
          userId,
          questionId: wrongQuestionData.questionId,
          userAnswer: wrongQuestionData.userAnswer,
          correctAnswer: wrongQuestionData.correctAnswer,
          explanation: wrongQuestionData.explanation,
          wrongCount: 1,
          isSolved: false
        });

        const saved = await this.wrongQuestionRepository.save(wrongQuestion);
        return BaseResponse.success(saved, '错题添加成功');
      }
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
   * 获取学习计划
   */
  async getStudyPlans(userId: number) {
    try {
      const plans = await this.studyPlanRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      return BaseResponse.success(plans, '获取学习计划成功');
    } catch (error) {
      console.error('获取学习计划失败:', error);
      throw BusinessException.systemError('获取学习计划失败');
    }
  }

  /**
   * 创建学习计划
   */
  async createStudyPlan(userId: number, planData: any) {
    try {
      const plan = this.studyPlanRepository.create({
        userId,
        name: planData.name,
        title: planData.title || planData.name,
        description: planData.description,
        startDate: planData.startDate || new Date(),
        endDate: planData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 默认30天后
        dailyTime: planData.dailyTime || 60,
        subjects: planData.subjects || [],
        content: planData.content || {
          knowledgePoints: [],
          dailyQuestionCount: 10,
          difficulty: 'medium'
        },
        totalDays: planData.totalDays || 30,
        status: 'active'
      });

      const saved = await this.studyPlanRepository.save(plan);
      return BaseResponse.success(saved, '学习计划创建成功');
    } catch (error) {
      console.error('创建学习计划失败:', error);
      throw BusinessException.systemError('创建学习计划失败');
    }
  }

  /**
   * 更新学习计划
   */
  async updateStudyPlan(userId: number, planId: number, planData: any) {
    try {
      const plan = await this.studyPlanRepository.findOne({
        where: { id: planId, userId }
      });

      if (!plan) {
        throw BusinessException.notFoundError('学习计划不存在');
      }

      Object.assign(plan, planData);
      const updated = await this.studyPlanRepository.save(plan);
      
      return BaseResponse.success(updated, '学习计划更新成功');
    } catch (error) {
      console.error('更新学习计划失败:', error);
      if (error instanceof BusinessException) {
        throw error;
      }
      throw BusinessException.systemError('更新学习计划失败');
    }
  }

  /**
   * 完成学习计划
   */
  async completeStudyPlan(userId: number, planId: number) {
    try {
      const plan = await this.studyPlanRepository.findOne({
        where: { id: planId, userId }
      });

      if (!plan) {
        throw BusinessException.notFoundError('学习计划不存在');
      }

      plan.status = 'completed';
      plan.completedAt = new Date();
      
      const updated = await this.studyPlanRepository.save(plan);
      return BaseResponse.success(updated, '学习计划完成');
    } catch (error) {
      console.error('完成学习计划失败:', error);
      if (error instanceof BusinessException) {
        throw error;
      }
      throw BusinessException.systemError('完成学习计划失败');
    }
  }

  /**
   * 获取今日学习状态
   */
  async getTodayStatus(userId: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayRecord = await this.studyRecordRepository.findOne({
        where: {
          userId,
          studyDate: {
            $gte: today,
            $lt: tomorrow
          } as any
        }
      });

      const status = {
        hasStudiedToday: !!todayRecord,
        todayStudyTime: todayRecord?.studyTime || 0,
        todayQuestions: todayRecord?.completedQuestions || 0,
        todayAccuracy: todayRecord?.accuracy || 0
      };

      return BaseResponse.success(status, '获取今日状态成功');
    } catch (error) {
      console.error('获取今日状态失败:', error);
      throw BusinessException.systemError('获取今日状态失败');
    }
  }

  /**
   * 保存每日学习记录
   */
  async saveDailyRecord(userId: number, recordData: any) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 查找今日记录
      let todayRecord = await this.studyRecordRepository.findOne({
        where: {
          userId,
          studyDate: Between(today, tomorrow)
        }
      });

      if (todayRecord) {
        // 更新今日记录
        todayRecord.studyTime += recordData.studyTime;
        todayRecord.completedQuestions += recordData.completedQuestions;
        // 重新计算平均准确率
        todayRecord.accuracy = Math.round(
          (todayRecord.accuracy + recordData.accuracy) / 2
        );
        
        const updated = await this.studyRecordRepository.save(todayRecord);
        return BaseResponse.success(updated, '今日记录更新成功');
      } else {
        // 创建新的今日记录
        const newRecord = this.studyRecordRepository.create({
          userId,
          studyTime: recordData.studyTime,
          completedQuestions: recordData.completedQuestions,
          accuracy: recordData.accuracy,
          studyDate: new Date()
        });

        const saved = await this.studyRecordRepository.save(newRecord);
        return BaseResponse.success(saved, '今日记录创建成功');
      }
    } catch (error) {
      console.error('保存每日记录失败:', error);
      throw BusinessException.systemError('保存每日记录失败');
    }
  }
}