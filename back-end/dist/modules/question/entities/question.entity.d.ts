import { BaseEntity } from '../../../common/entities/base.entity';
import { KnowledgePoint } from '../../knowledge/entities/knowledge-point.entity';
import { StudyRecord } from '../../study/entities/study-record.entity';
import { WrongQuestion } from '../../study/entities/wrong-question.entity';
export declare class Question extends BaseEntity {
    content: string;
    type: 'single' | 'multiple' | 'judge' | 'calculation';
    options: string[];
    correctAnswer: string;
    explanation: string;
    knowledgePointId: number;
    difficulty: 'easy' | 'medium' | 'hard';
    answerCount: number;
    correctCount: number;
    tags: string[];
    isActive: boolean;
    source: string;
    year: number;
    knowledgePoint: KnowledgePoint;
    studyRecords: StudyRecord[];
    wrongQuestions: WrongQuestion[];
}
