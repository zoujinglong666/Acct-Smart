import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('study_plans')
export class StudyPlan extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '计划名称' })
  name: string;

  @Column({ comment: '计划标题' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '计划描述' })
  description: string;

  @Column({ type: 'date', comment: '开始日期' })
  startDate: Date;

  @Column({ type: 'date', comment: '结束日期' })
  endDate: Date;

  @Column({ type: 'date', nullable: true, comment: '目标日期' })
  targetDate: Date;

  @Column({ default: 60, comment: '每日学习时间（分钟）' })
  dailyTime: number;

  @Column({ type: 'json', nullable: true, comment: '学习科目' })
  subjects: string[];

  @Column({ type: 'json', comment: '学习内容配置' })
  content: {
    knowledgePoints: number[]; // 知识点ID数组
    dailyQuestionCount: number; // 每日题目数量
    difficulty: 'easy' | 'medium' | 'hard'; // 难度级别
  };

  @Column({ type: 'enum', enum: ['active', 'completed', 'paused', 'draft'], default: 'active', comment: '计划状态' })
  status: 'active' | 'completed' | 'paused' | 'draft';

  @Column({ default: 0, comment: '完成进度（百分比）' })
  progress: number;

  @Column({ default: 0, comment: '总天数' })
  totalDays: number;

  @Column({ default: 0, comment: '已学习天数' })
  studiedDays: number;

  @Column({ type: 'timestamp', nullable: true, comment: '完成时间' })
  completedAt: Date;

  @Column({ type: 'json', nullable: true, comment: '学习统计' })
  statistics: {
    totalDays: number;
    studiedDays: number;
    totalQuestions: number;
    completedQuestions: number;
  };

  // 关联关系
  @ManyToOne(() => User, user => user.studyPlans)
  @JoinColumn({ name: 'userId' })
  user: User;
}
