
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Question } from '../../question/entities/question.entity';

@Entity('knowledge_points')
export class KnowledgePoint extends BaseEntity {
  @Column({ nullable: true, comment: '知识点名称' })
  title: string;

  @Column({ type: 'text', comment: '知识点内容' })
  content: string;

  @Column({ nullable: true, comment: '父级知识点ID' })
  parentId: number;

  @Column({ nullable: true, comment: '章节编号' })
  chapterNumber: string;

  @Column({ nullable: true, default: 0, comment: '排序权重' })
  sortOrder: number;

  @Column({ type: 'enum', enum: ['basic', 'important', 'difficult'], default: 'basic', comment: '重要程度' })
  importance: 'basic' | 'important' | 'difficult';

  @Column({ type: 'json', nullable: true, comment: '知识点标签' })
  tags: string[];

  @Column({ default: 0, comment: '学习人数' })
  studyCount: number;

  // 关联关系
  @ManyToOne(() => KnowledgePoint, point => point.children)
  @JoinColumn({ name: 'parentId' })
  parent: KnowledgePoint;

  @OneToMany(() => KnowledgePoint, point => point.parent)
  children: KnowledgePoint[];

  @OneToMany(() => Question, question => question.knowledgePoint)
  questions: Question[];

}