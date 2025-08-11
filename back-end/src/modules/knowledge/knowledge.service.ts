import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgePoint } from './entities/knowledge-point.entity';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(KnowledgePoint)
    private knowledgePointRepository: Repository<KnowledgePoint>,
  ) {}

  /**
   * 获取所有章节
   */
  async getChapters() {
    return this.knowledgePointRepository
      .createQueryBuilder('kp')
      .where('kp.parentId IS NULL')
      .orderBy('kp.sortOrder', 'ASC')
      .getMany();
  }

  /**
   * 获取知识点详情
   */
  async getKnowledgePoint(id: number) {
    const point = await this.knowledgePointRepository.findOne({
      where: { id },
      relations: ['children', 'questions']
    });

    if (!point) {
      throw BusinessException.notFoundError('知识点不存在');
    }

    return point;
  }

  /**
   * 获取章节下的知识点
   */
  async getKnowledgePointsByChapter(chapterNumber: string) {
    return this.knowledgePointRepository
      .createQueryBuilder('kp')
      .where('kp.chapterNumber LIKE :chapter', { chapter: `${chapterNumber}%` })
      .orderBy('kp.sortOrder', 'ASC')
      .getMany();
  }

  /**
   * 搜索知识点
   */
  async searchKnowledgePoints(keyword: string) {
    return this.knowledgePointRepository
      .createQueryBuilder('kp')
      .where('kp.title LIKE :keyword OR kp.content LIKE :keyword', {
        keyword: `%${keyword}%`
      })
      .orderBy('kp.studyCount', 'DESC')
      .take(20)
      .getMany();
  }

  /**
   * 更新学习次数
   */
  async updateStudyCount(id: number) {
    await this.knowledgePointRepository
      .createQueryBuilder()
      .update(KnowledgePoint)
      .set({ studyCount: () => 'study_count + 1' })
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 获取所有知识点
   */
  async findAll() {
    return this.knowledgePointRepository.find({
      order: { sortOrder: 'ASC' }
    });
  }

  /**
   * 根据ID获取知识点
   */
  async findOne(id: number) {
    const point = await this.knowledgePointRepository.findOne({
      where: { id },
      relations: ['children', 'questions']
    });

    if (!point) {
      throw BusinessException.notFoundError('知识点不存在');
    }

    return point;
  }

  /**
   * 根据知识点获取题目
   */
  async getQuestionsByKnowledgePoint(knowledgePointId: number) {
    const point = await this.knowledgePointRepository.findOne({
      where: { id: knowledgePointId },
      relations: ['questions']
    });

    if (!point) {
      throw BusinessException.notFoundError('知识点不存在');
    }

    return point.questions;
  }

  /**
   * 获取知识点树形结构
   */
  async getKnowledgeTree() {
    const knowledgePoints = await this.knowledgePointRepository.find({
      order: { sortOrder: 'ASC' },
    });

    // 构建树形结构
    const tree = this.buildTree(knowledgePoints);
    return tree;
  }

  /**
   * 构建树形结构的辅助方法
   */
  private buildTree(points: KnowledgePoint[], parentId: number | null = null): any[] {
    return points
      .filter(point => point.parentId === parentId)
      .map(point => ({
        ...point,
        children: this.buildTree(points, point.id)
      }));
  }
}
