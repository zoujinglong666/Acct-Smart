import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ExamRecord } from './exam-record.entity';

@Entity('exam_papers')
export class ExamPaper extends BaseEntity {
  @Column({ comment: '试卷名称' })
  title: string;

  @Column({ type: 'text', comment: '试卷描述' })
  description: string;

  @Column({ type: 'enum', enum: ['mock', 'sprint', 'daily'], comment: '试卷类型' })
  type: 'mock' | 'sprint' | 'daily';

  @Column({ type: 'json', nullable: true, comment: '题目ID列表' })
  questionIds: number[];

  @Column({ comment: '考试时长（分钟）' })
  duration: number;

  @Column({ nullable: true, comment: '总分' })
  totalScore: number;

  @Column({ nullable: true, comment: '及格分数' })
  passScore: number;

  @Column({ type: 'json', nullable: true, comment: '题型分布' })
  questionDistribution: {
    single: number;    // 单选题数量
    multiple: number;  // 多选题数量
    judge: number;     // 判断题数量
    calculation: number; // 计算题数量
  };

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @Column({ type: 'json', nullable: true, comment: '考试说明' })
  instructions: string[];

  // 关联关系
  @OneToMany(() => ExamRecord, record => record.examPaper)
  examRecords: ExamRecord[];
}