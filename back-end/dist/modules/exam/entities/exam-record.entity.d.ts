import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ExamPaper } from './exam-paper.entity';
export declare class ExamRecord extends BaseEntity {
    userId: number;
    examPaperId: number;
    userAnswers: {
        questionId: number;
        answer: string;
        timeSpent: number;
    }[];
    totalScore: number;
    userScore: number;
    correctCount: number;
    totalCount: number;
    timeUsed: number;
    status: 'completed' | 'timeout' | 'abandoned';
    scoreByType: {
        single: number;
        multiple: number;
        judge: number;
        calculation: number;
    };
    startTime: Date;
    endTime: Date;
    user: User;
    examPaper: ExamPaper;
}
