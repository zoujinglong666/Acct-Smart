import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { StudyRecord } from '../study/entities/study-record.entity';
import { WrongQuestion } from '../study/entities/wrong-question.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
    @InjectRepository(WrongQuestion)
    private wrongQuestionRepository: Repository<WrongQuestion>,
  ) {}

  /**
   * 获取高频错题
   */
  async getHighFrequencyWrongQuestions(limit: number = 50) {
    const query = `
      SELECT 
        q.*,
        COUNT(sr.id) as total_attempts,
        COUNT(CASE WHEN sr.is_correct = false THEN 1 END) as wrong_count,
        ROUND(
          COUNT(CASE WHEN sr.is_correct = false THEN 1 END) * 100.0 / COUNT(sr.id), 
          2
        ) as error_rate
      FROM questions q
      LEFT JOIN study_records sr ON q.id = sr.question_id
      WHERE sr.id IS NOT NULL
      GROUP BY q.id
      HAVING COUNT(sr.id) >= 10
      ORDER BY error_rate DESC, wrong_count DESC
      LIMIT $1
    `;

    const result = await this.questionRepository.query(query, [limit]);
    return result;
  }

  /**
   * 获取用户错题分析
   */
  async getUserWrongQuestionAnalysis(userId: number) {
    // 获取用户错题统计
    const wrongStats = await this.wrongQuestionRepository
      .createQueryBuilder('wq')
      .leftJoinAndSelect('wq.question', 'q')
      .leftJoinAndSelect('q.knowledgePoint', 'kp')
      .where('wq.userId = :userId', { userId })
      .andWhere('wq.isMastered = false')
      .orderBy('wq.wrongCount', 'DESC')
      .getMany();

    // 按知识点分组统计
    const knowledgePointStats = {};
    wrongStats.forEach(item => {
      const kpId = item.question.knowledgePointId;
      if (!knowledgePointStats[kpId]) {
        knowledgePointStats[kpId] = {
          knowledgePoint: item.question.knowledgePoint,
          wrongCount: 0,
          questions: []
        };
      }
      knowledgePointStats[kpId].wrongCount += item.wrongCount;
      knowledgePointStats[kpId].questions.push(item);
    });

    return {
      totalWrongQuestions: wrongStats.length,
      wrongQuestions: wrongStats,
      weakKnowledgePoints: Object.values(knowledgePointStats)
        .sort((a: any, b: any) => b.wrongCount - a.wrongCount)
        .slice(0, 10)
    };
  }

  /**
   * 生成错因分析
   */
  async analyzeWrongReasons(userId: number, questionId: number) {
    const records = await this.studyRecordRepository.find({
      where: { userId, questionId, isCorrect: false },
      order: { createdAt: 'DESC' },
      take: 5
    });

    if (records.length === 0) {
      return { reasons: [], suggestions: [] };
    }

    // 分析错误模式
    const reasons = [];
    const timeSpents = records.map(r => r.timeSpent);
    const avgTime = timeSpents.reduce((a, b) => a + b, 0) / timeSpents.length;

    if (avgTime < 30) {
      reasons.push('答题过快，可能存在粗心问题');
    } else if (avgTime > 300) {
      reasons.push('答题时间过长，可能概念不清晰');
    }

    if (records.length >= 3) {
      reasons.push('多次答错，需要重点复习相关知识点');
    }

    // 生成建议
    const suggestions = [
      '重新学习相关知识点',
      '做类似题目加强练习',
      '总结解题方法和技巧',
      '制作错题笔记'
    ];

    return { reasons, suggestions };
  }

  /**
   * 计算记忆曲线复习时间
   */
  calculateReviewSchedule(lastWrongTime: Date): Date[] {
    const schedule = [];
    const baseTime = new Date(lastWrongTime);
    
    // 艾宾浩斯遗忘曲线：1天、3天、7天、15天、30天
    const intervals = [1, 3, 7, 15, 30];
    
    intervals.forEach(days => {
      const reviewTime = new Date(baseTime);
      reviewTime.setDate(reviewTime.getDate() + days);
      schedule.push(reviewTime);
    });

    return schedule;
  }

  /**
   * 获取今日需要复习的错题
   */
  async getTodayReviewQuestions(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 这里需要一个复习计划表来存储复习时间
    // 简化实现：获取3天前、7天前、15天前的错题
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const reviewQuestions = await this.wrongQuestionRepository
      .createQueryBuilder('wq')
      .leftJoinAndSelect('wq.question', 'q')
      .where('wq.userId = :userId', { userId })
      .andWhere('wq.isMastered = false')
      .andWhere(
        '(DATE(wq.lastWrongTime) = DATE(:threeDaysAgo) OR DATE(wq.lastWrongTime) = DATE(:sevenDaysAgo) OR DATE(wq.lastWrongTime) = DATE(:fifteenDaysAgo))',
        { threeDaysAgo, sevenDaysAgo, fifteenDaysAgo }
      )
      .orderBy('wq.wrongCount', 'DESC')
      .getMany();

    return reviewQuestions;
  }

  /**
   * 获取学习数据统计
   */
  async getStudyStatistics(userId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyStats = await this.studyRecordRepository
      .createQueryBuilder('sr')
      .select([
        'DATE(sr.createdAt) as date',
        'COUNT(*) as questionCount',
        'COUNT(CASE WHEN sr.isCorrect = true THEN 1 END) as correctCount',
        'AVG(sr.timeSpent) as avgTimeSpent'
      ])
      .where('sr.userId = :userId', { userId })
      .andWhere('sr.createdAt >= :startDate', { startDate })
      .groupBy('DATE(sr.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return dailyStats;
  }
}