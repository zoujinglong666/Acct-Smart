import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  /**
   * 获取题目列表
   */
  async findAll(page: number = 1, limit: number = 20, filters?: any) {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.knowledgePoint', 'kp')
      .where('q.isActive = :isActive', { isActive: true });

    if (filters?.type) {
      queryBuilder.andWhere('q.type = :type', { type: filters.type });
    }

    if (filters?.difficulty) {
      queryBuilder.andWhere('q.difficulty = :difficulty', { difficulty: filters.difficulty });
    }

    if (filters?.knowledgePointId) {
      queryBuilder.andWhere('q.knowledgePointId = :knowledgePointId', { 
        knowledgePointId: filters.knowledgePointId 
      });
    }

    const [questions, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('q.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 根据ID获取题目
   */
  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['knowledgePoint'],
    });

    if (!question) {
      throw BusinessException.notFoundError('题目不存在');
    }

    return question;
  }

  /**
   * 随机获取题目
   */
  async getRandomQuestions(count: number = 5, filters?: any) {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.knowledgePoint', 'kp')
      .where('q.isActive = :isActive', { isActive: true });

    if (filters?.type) {
      queryBuilder.andWhere('q.type = :type', { type: filters.type });
    }

    if (filters?.difficulty) {
      queryBuilder.andWhere('q.difficulty = :difficulty', { difficulty: filters.difficulty });
    }

    if (filters?.knowledgePointIds && filters.knowledgePointIds.length > 0) {
      queryBuilder.andWhere('q.knowledgePointId IN (:...ids)', { 
        ids: filters.knowledgePointIds 
      });
    }

    return queryBuilder
      .orderBy('RANDOM()')
      .take(count)
      .getMany();
  }

  /**
   * 更新题目统计
   */
  async updateQuestionStats(id: number, isCorrect: boolean) {
    const updateData: any = {
      answerCount: () => 'answer_count + 1',
    };

    if (isCorrect) {
      updateData.correctCount = () => 'correct_count + 1';
    }

    await this.questionRepository
      .createQueryBuilder()
      .update(Question)
      .set(updateData)
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 保存OCR识别的题目
   */
  async saveOcrQuestion(questionData: any) {
    const question = this.questionRepository.create({
      content: questionData.question,
      type: questionData.type || 'single',
      options: questionData.options || [],
      correctAnswer: questionData.correctAnswer || '',
      explanation: questionData.analysis || '',
      knowledgePointId: questionData.knowledgePointId || 1,
      difficulty: 'medium',
      source: 'OCR识别',
    });

    return this.questionRepository.save(question);
  }

  /**
   * 获取每日题目
   */
  async getDailyQuestions(userId: number) {
    return this.getRandomQuestions(5, { type: 'single' });
  }

  /**
   * 获取错题
   */
  async getWrongQuestions(userId: number) {
    // 这里需要关联WrongQuestion表，暂时返回空数组
    return [];
  }

  /**
   * 获取高频错题
   */
  async getHighFrequencyWrongQuestions(userId: number) {
    // 这里需要关联WrongQuestion表，暂时返回空数组
    return [];
  }

  /**
   * 根据知识点获取题目
   */
  async getQuestionsByKnowledgePoint(knowledgePointId: string) {
    return this.questionRepository.find({
      where: { knowledgePointId: parseInt(knowledgePointId) },
      relations: ['knowledgePoint']
    });
  }

  /**
   * 提交答案
   */
  async submitAnswer(userId: number, questionId: string, userAnswer: string, isCorrect: boolean, timeSpent: number) {
    // 更新题目统计
    await this.updateQuestionStats(parseInt(questionId), isCorrect);
    
    // 这里应该保存学习记录，暂时返回成功状态
    return {
      success: true,
      isCorrect,
      explanation: '答案解析...'
    };
  }

  /**
   * 获取题目分析
   */
  async getQuestionAnalysis(questionId: string) {
    const question = await this.findOne(parseInt(questionId));
    return {
      question,
      analysis: question.explanation,
      difficulty: question.difficulty,
      correctRate: question.answerCount > 0 ? (question.correctCount / question.answerCount * 100).toFixed(1) : '0'
    };
  }

  /**
   * 搜索题目
   */
  async searchQuestions(keyword: string, difficulty?: string, knowledgePointId?: string) {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.knowledgePoint', 'kp')
      .where('q.isActive = :isActive', { isActive: true });

    if (keyword) {
      queryBuilder.andWhere('q.content LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (difficulty) {
      queryBuilder.andWhere('q.difficulty = :difficulty', { difficulty });
    }

    if (knowledgePointId) {
      queryBuilder.andWhere('q.knowledgePointId = :knowledgePointId', { 
        knowledgePointId: parseInt(knowledgePointId) 
      });
    }

    return queryBuilder
      .orderBy('q.createdAt', 'DESC')
      .take(20)
      .getMany();
  }
}
