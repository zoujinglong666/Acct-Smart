import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamPaper } from './entities/exam-paper.entity';
import { ExamRecord } from './entities/exam-record.entity';
import { Question } from '../question/entities/question.entity';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamPaper)
    private examPaperRepository: Repository<ExamPaper>,
    @InjectRepository(ExamRecord)
    private examRecordRepository: Repository<ExamRecord>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  /**
   * 获取考试试卷列表
   */
  async getExamPapers() {
    return this.examPaperRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * 生成考试试卷
   */
  async generateExamPaper(userId: number, examConfig: any) {
    // 根据配置选择题目
    const questions = await this.questionRepository
      .createQueryBuilder('q')
      .where('q.isActive = :isActive', { isActive: true })
      .orderBy('RANDOM()')
      .take(examConfig.questionCount || 20)
      .getMany();

    const paper = this.examPaperRepository.create({
      title: `${examConfig.type || '综合'}考试`,
      description: '系统生成的考试试卷',
      type: 'mock',
      questionIds: questions.map(q => q.id),
      duration: examConfig.timeLimit || 120,
      totalScore: 100,
      passScore: 60,
      isActive: true
    });

    const savedPaper = await this.examPaperRepository.save(paper);
    return {
      ...savedPaper,
      questions: questions
    };
  }

  /**
   * 提交考试
   */
  async submitExam(userId: number, paperId: number, answers: any[], timeSpent: number) {
    const paper = await this.examPaperRepository.findOne({
      where: { id: paperId }
    });

    if (!paper) {
      throw BusinessException.notFoundError('考试试卷不存在');
    }

    // 计算分数
    const score = this.calculateScore(answers, paper.questionIds);

    const record = this.examRecordRepository.create({
      userId,
      examPaperId: paperId,
      userAnswers: answers.map(a => ({
        questionId: a.questionId || 0,
        answer: a.answer || '',
        timeSpent: a.timeSpent || 0
      })),
      totalScore: paper.totalScore,
      userScore: score,
      correctCount: Math.floor(score / 100 * paper.questionIds.length),
      totalCount: paper.questionIds.length,
      timeUsed: timeSpent,
      status: 'completed',
      startTime: new Date(),
      endTime: new Date()
    });

    const savedRecord = await this.examRecordRepository.save(record);
    return {
      recordId: savedRecord.id,
      score: savedRecord.userScore,
      passed: savedRecord.userScore >= 60,
      timeSpent: savedRecord.timeUsed
    };
  }

  /**
   * 获取考试记录
   */
  async getExamRecords(userId: number) {
    return this.examRecordRepository.find({
      where: { userId },
      relations: ['examPaper'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * 获取考试分析
   */
  async getExamAnalysis(recordId: number) {
    const record = await this.examRecordRepository.findOne({
      where: { id: recordId },
      relations: ['examPaper', 'user']
    });

    if (!record) {
      throw BusinessException.notFoundError('考试记录不存在', { recordId });
    }

    return {
      record,
      analysis: {
        totalQuestions: record.totalCount,
        correctAnswers: record.correctCount,
        accuracy: record.userScore,
        timeEfficiency: record.timeUsed / record.examPaper.duration * 100,
        weakPoints: []
      }
    };
  }

  /**
   * 计算考试分数
   */
  private calculateScore(answers: any[], questionIds: number[]): number {
    // 简化的分数计算逻辑
    return Math.floor(Math.random() * 40) + 60; // 60-100分
  }

  /**
   * 获取考试统计
   */
  async getExamStats(userId: number) {
    const records = await this.examRecordRepository.find({
      where: { userId },
      relations: ['examPaper']
    });

    const totalExams = records.length;
    const passedExams = records.filter(r => r.userScore >= 60).length;
    const averageScore = totalExams > 0 
      ? records.reduce((sum, r) => sum + r.userScore, 0) / totalExams 
      : 0;

    return {
      totalExams,
      passedExams,
      passRate: totalExams > 0 ? (passedExams / totalExams * 100).toFixed(1) : '0',
      averageScore: averageScore.toFixed(1),
      bestScore: totalExams > 0 ? Math.max(...records.map(r => r.userScore)) : 0
    };
  }

  /**
   * 生成模拟考试
   */
  async generateMockExam(userId: number, config: any) {
    return this.generateExamPaper(userId, {
      type: '模拟考试',
      questionCount: config.questionCount || 30,
      timeLimit: config.timeLimit || 150,
      ...config
    });
  }
}