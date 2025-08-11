import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';

@Entity('study_records')
export class StudyRecord extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ nullable: true, comment: '题目ID' })
  questionId: number;

  @Column({ nullable: true, comment: '用户答案' })
  userAnswer: string;

  @Column({ default: false, comment: '是否正确' })
  isCorrect: boolean;

  @Column({ default: 0, comment: '答题用时（秒）' })
  timeSpent: number;

  @Column({ type: 'enum', enum: ['practice', 'exam', 'daily', 'knowledge'], default: 'practice', comment: '学习类型' })
  type: 'practice' | 'exam' | 'daily' | 'knowledge';

  @Column({ nullable: true, comment: '目标ID（题目ID或知识点ID）' })
  targetId: string;

  @Column({ default: 0, comment: '学习时长（分钟）' })
  studyTime: number;

  @Column({ default: 0, comment: '完成题目数' })
  completedQuestions: number;

  @Column({ default: 0, comment: '正确率（百分比）' })
  accuracy: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', comment: '学习日期' })
  studyDate: Date;

  @Column({ default: 0, comment: '学习进度（百分比）' })
  progress: number;

  @Column({ nullable: true, comment: '考试记录ID' })
  examRecordId: number;

  // 关联关系
  @ManyToOne(() => User, user => user.studyRecords)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Question, question => question.studyRecords, { nullable: true })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
