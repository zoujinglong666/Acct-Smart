import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ExamPaper } from './exam-paper.entity';

@Entity('exam_records')
export class ExamRecord extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '试卷ID' })
  examPaperId: number;

  @Column({ type: 'json', comment: '用户答案' })
  userAnswers: {
    questionId: number;
    answer: string;
    timeSpent: number;
  }[];

  @Column({ comment: '总分' })
  totalScore: number;

  @Column({ comment: '用户得分' })
  userScore: number;

  @Column({ comment: '正确题目数' })
  correctCount: number;

  @Column({ comment: '总题目数' })
  totalCount: number;

  @Column({ comment: '考试用时（秒）' })
  timeUsed: number;

  @Column({ type: 'enum', enum: ['completed', 'timeout', 'abandoned'], comment: '考试状态' })
  status: 'completed' | 'timeout' | 'abandoned';

  @Column({ type: 'json', nullable: true, comment: '各题型得分' })
  scoreByType: {
    single: number;
    multiple: number;
    judge: number;
    calculation: number;
  };

  @Column({ type: 'timestamp', comment: '开始时间' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true, comment: '结束时间' })
  endTime: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => ExamPaper, paper => paper.examRecords)
  @JoinColumn({ name: 'examPaperId' })
  examPaper: ExamPaper;
}