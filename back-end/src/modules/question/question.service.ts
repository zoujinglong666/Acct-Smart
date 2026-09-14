import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { StudyRecord } from '../study/entities/study-record.entity';
import { WrongQuestion } from '../study/entities/wrong-question.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
    @InjectRepository(WrongQuestion)
    private wrongQuestionRepository: Repository<WrongQuestion>,
    private userService: UserService,
  ) {}

  /**
   * 获取每日题目（随机 5 道单选）
   */
  async getDailyQuestions(userId: number) {
    return this.getRandomQuestions(5, { type: 'single' });
  }

  /**
   * 随机获取题目（不带关联查询，避免 DISTINCT + RANDOM() 在 PostgreSQL 下的兼容问题）
   */
  async getRandomQuestions(count: number = 5, filters?: any) {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('q')
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

    return queryBuilder
      .orderBy('RANDOM()')
      .take(count)
      .getMany();
  }

  /**
   * 根据知识点获取题目
   */
  async getQuestionsByKnowledgePoint(knowledgePointId: string) {
    return this.questionRepository.find({
      where: { knowledgePointId: parseInt(knowledgePointId), isActive: true },
      relations: ['knowledgePoint']
    });
  }

  /**
   * 提交答案（MVP 闭环核心）：
   * 后端判分 -> 存答题流水 -> 答错自动收错题 -> 更新题目与用户统计
   */
  async submitAnswer(userId: number, questionId: string, userAnswer: string, timeSpent: number) {
    const question = await this.questionRepository.findOne({
      where: { id: parseInt(questionId), isActive: true }
    });

    if (!question) {
      throw BusinessException.notFoundError('题目不存在');
    }

    // 1. 后端判分
    const isCorrect = this.checkAnswer(question, userAnswer);

    // 2. 存答题流水
    const record = this.studyRecordRepository.create({
      userId,
      questionId: question.id,
      userAnswer,
      isCorrect,
      timeSpent: timeSpent || 0,
      type: 'practice'
    });
    await this.studyRecordRepository.save(record);

    // 3. 答错自动收错题
    if (!isCorrect) {
      await this.upsertWrongQuestion(userId, question, userAnswer);
    }

    // 4. 更新题目统计
    await this.updateQuestionStats(question.id, isCorrect);

    // 5. 更新用户统计
    await this.userService.updateStudyStats(userId, 0, 1, isCorrect ? 1 : 0);

    return {
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }

  /**
   * 后端判分：单选/多选取选项字母比较，判断题为"正确/错误"文本比较
   */
  private checkAnswer(question: Question, userAnswer: string): boolean {
    if (!userAnswer) return false;

    // 规范化：纯选项字母（D / AB）原样返回；带选项文本（"A. 相关性"）提取字母；判断题保留文本
    const normalize = (answer: string) => {
      const a = String(answer).trim().toUpperCase();
      if (/^[A-Z]+$/.test(a)) return a;
      const m = a.match(/^([A-Z]+)[.．、:：\s]+/);
      return m ? m[1] : a.replace(/[.．、\s]/g, '');
    };

    const user = normalize(userAnswer);
    const correct = normalize(question.correctAnswer || '');

    if (!correct) return false;

    if (question.type === 'multiple') {
      return [...user].sort().join('') === [...correct].sort().join('');
    }
    return user === correct;
  }

  /**
   * 错题 upsert：已存在则次数 +1 并重置掌握状态
   */
  private async upsertWrongQuestion(userId: number, question: Question, userAnswer: string) {
    const existing = await this.wrongQuestionRepository.findOne({
      where: { userId, questionId: question.id }
    });

    if (existing) {
      existing.wrongCount += 1;
      existing.userAnswer = userAnswer;
      existing.lastWrongTime = new Date();
      if (existing.isSolved || existing.isMastered) {
        existing.isSolved = false;
        existing.isMastered = false;
      }
      await this.wrongQuestionRepository.save(existing);
      return;
    }

    const wrongQuestion = this.wrongQuestionRepository.create({
      userId,
      questionId: question.id,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      wrongCount: 1,
      isSolved: false
    });
    await this.wrongQuestionRepository.save(wrongQuestion);
  }

  /**
   * 更新题目统计
   */
  async updateQuestionStats(id: number, isCorrect: boolean) {
    const updateData: any = {
      answerCount: () => 'answerCount + 1',
    };

    if (isCorrect) {
      updateData.correctCount = () => 'correctCount + 1';
    }

    await this.questionRepository
      .createQueryBuilder()
      .update(Question)
      .set(updateData)
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 获取题目解析
   */
  async getQuestionAnalysis(questionId: string) {
    const question = await this.questionRepository.findOne({
      where: { id: parseInt(questionId) },
      relations: ['knowledgePoint']
    });

    if (!question) {
      throw BusinessException.notFoundError('题目不存在');
    }

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
