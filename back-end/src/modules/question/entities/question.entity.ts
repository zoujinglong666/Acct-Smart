import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { KnowledgePoint } from '../../knowledge/entities/knowledge-point.entity';
import { StudyRecord } from '../../study/entities/study-record.entity';
import { WrongQuestion } from '../../study/entities/wrong-question.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @Column({ type: 'text', comment: '题目内容' })
  content: string;

  @Column({ type: 'enum', enum: ['single', 'multiple', 'judge', 'calculation'], nullable: true, comment: '题目类型' })
  type: 'single' | 'multiple' | 'judge' | 'calculation';

  @Column({ type: 'json', nullable: true, comment: '选项' })
  options: string[];

  @Column({ nullable: true, comment: '正确答案' })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true, comment: '题目解析' })
  explanation: string;

  @Column({ nullable: true, comment: '知识点ID' })
  knowledgePointId: number;

  @Column({ type: 'enum', enum: ['easy', 'medium', 'hard'], default: 'medium', comment: '难度' })
  difficulty: 'easy' | 'medium' | 'hard';

  @Column({ default: 0, comment: '答题次数' })
  answerCount: number;

  @Column({ default: 0, comment: '正确次数' })
  correctCount: number;

  @Column({ type: 'json', nullable: true, comment: '标签' })
  tags: string[];

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @Column({ nullable: true, comment: '题目来源' })
  source: string;

  @Column({ nullable: true, comment: '年份' })
  year: number;

  // 关联关系
  @ManyToOne(() => KnowledgePoint, point => point.questions)
  @JoinColumn({ name: 'knowledgePointId' })
  knowledgePoint: KnowledgePoint;

  @OneToMany(() => StudyRecord, record => record.question)
  studyRecords: StudyRecord[];

  @OneToMany(() => WrongQuestion, wrongQuestion => wrongQuestion.question)
  wrongQuestions: WrongQuestion[];
}