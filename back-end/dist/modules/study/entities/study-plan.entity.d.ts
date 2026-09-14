import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
export declare class StudyPlan extends BaseEntity {
    userId: number;
    name: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    targetDate: Date;
    dailyTime: number;
    subjects: string[];
    content: {
        knowledgePoints: number[];
        dailyQuestionCount: number;
        difficulty: 'easy' | 'medium' | 'hard';
    };
    status: 'active' | 'completed' | 'paused' | 'draft';
    progress: number;
    totalDays: number;
    studiedDays: number;
    completedAt: Date;
    statistics: {
        totalDays: number;
        studiedDays: number;
        totalQuestions: number;
        completedQuestions: number;
    };
    user: User;
}
