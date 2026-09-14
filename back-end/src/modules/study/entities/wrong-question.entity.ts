import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';

@Entity('wrong_questions')
export class WrongQuestion extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '题目ID' })
  questionId: number;

  @Column({ comment: '用户答案' })
  userAnswer: string;

  @Column({ comment: '正确答案' })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true, comment: '题目解析' })
  explanation: string;

  @Column({ default: 1, comment: '错误次数' })
  wrongCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '最后错误时间' })
  lastWrongTime: Date;

  @Column({ default: false, comment: '是否已掌握' })
  isMastered: boolean;

  @Column({ default: false, comment: '是否已解决' })
  isSolved: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: '解决时间' })
  solvedTime: Date;

  @Column({ type: 'json', nullable: true, comment: '错误原因分析' })
  wrongReasons: string[];

  @Column({ type: 'json', nullable: true, comment: '复习计划' })
  reviewSchedule: Date[];

  // 关联关系
  @ManyToOne(() => User, user => user.wrongQuestions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Question, question => question.wrongQuestions, { nullable: true })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
