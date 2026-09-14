import { BaseEntity } from '../../../common/entities/base.entity';
import { StudyRecord } from '../../study/entities/study-record.entity';
import { WrongQuestion } from '../../study/entities/wrong-question.entity';
export declare class User extends BaseEntity {
    openid: string;
    unionid: string;
    username: string;
    password: string;
    nickname: string;
    avatar: string;
    gender: string;
    phone: string;
    email: string;
    totalStudyTime: number;
    continuousStudyDays: number;
    lastStudyDate: Date;
    totalQuestions: number;
    correctQuestions: number;
    preferences: {
        dailyGoal: number;
        reminderTime: string;
        difficulty: 'easy' | 'medium' | 'hard';
    };
    isActive: boolean;
    studyRecords: StudyRecord[];
    wrongQuestions: WrongQuestion[];
}
