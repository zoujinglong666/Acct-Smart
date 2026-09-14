import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { StudyRecord } from '../../study/entities/study-record.entity';
import { WrongQuestion } from '../../study/entities/wrong-question.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true, comment: '微信openid' })
  openid: string;

  @Column({ nullable: true, comment: '微信unionid' })
  unionid: string;

  @Column({ nullable: true, comment: '用户名' })
  username: string;

  @Column({ nullable: true, comment: '密码' })
  password: string;

  @Column({ nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'varchar', length: 20, default: 'unknown', comment: '性别' })
  gender: string;

  @Column({ nullable: true, comment: '手机号' })
  phone: string;

  @Column({ nullable: true, comment: '邮箱' })
  email: string;

  @Column({ default: 0, comment: '总学习时长（分钟）' })
  totalStudyTime: number;

  @Column({ default: 0, comment: '连续学习天数' })
  continuousStudyDays: number;

  @Column({ type: 'date', nullable: true, comment: '最后学习日期' })
  lastStudyDate: Date;

  @Column({ default: 0, comment: '总答题数' })
  totalQuestions: number;

  @Column({ default: 0, comment: '正确答题数' })
  correctQuestions: number;

  @Column({ type: 'json', nullable: true, comment: '学习偏好设置' })
  preferences: {
    dailyGoal: number;
    reminderTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };

  @Column({ default: true, comment: '是否激活' })
  isActive: boolean;

  // 关联关系
  @OneToMany(() => StudyRecord, record => record.user)
  studyRecords: StudyRecord[];

  @OneToMany(() => WrongQuestion, wrongQuestion => wrongQuestion.user)
  wrongQuestions: WrongQuestion[];
}