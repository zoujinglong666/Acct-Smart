import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';
export declare class StudyRecord extends BaseEntity {
    userId: number;
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    type: 'practice' | 'exam' | 'daily' | 'knowledge';
    targetId: string;
    studyTime: number;
    completedQuestions: number;
    accuracy: number;
    studyDate: Date;
    progress: number;
    examRecordId: number;
    user: User;
    question: Question;
}
