import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';

@Entity('study_records')
export class StudyRecord extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '题目ID' })
  questionId: number;

  @Column({ nullable: true, comment: '用户答案' })
  userAnswer: string;

  @Column({ default: false, comment: '是否正确' })
  isCorrect: boolean;

  @Column({ default: 0, comment: '答题用时（秒）' })
  timeSpent: number;

  @Column({ type: 'enum', enum: ['practice', 'daily'], default: 'practice', comment: '练习类型' })
  type: 'practice' | 'daily';

  // 关联关系
  @ManyToOne(() => User, user => user.studyRecords)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Question, question => question.studyRecords, { nullable: true })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
