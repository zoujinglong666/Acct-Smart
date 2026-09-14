import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';
export declare class WrongQuestion extends BaseEntity {
    userId: number;
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    wrongCount: number;
    lastWrongTime: Date;
    isMastered: boolean;
    isSolved: boolean;
    solvedTime: Date;
    wrongReasons: string[];
    reviewSchedule: Date[];
    user: User;
    question: Question;
}
