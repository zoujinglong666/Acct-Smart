import { Repository } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { StudyRecord } from '../study/entities/study-record.entity';
import { WrongQuestion } from '../study/entities/wrong-question.entity';
export declare class AnalyticsService {
    private questionRepository;
    private studyRecordRepository;
    private wrongQuestionRepository;
    constructor(questionRepository: Repository<Question>, studyRecordRepository: Repository<StudyRecord>, wrongQuestionRepository: Repository<WrongQuestion>);
    getHighFrequencyWrongQuestions(limit?: number): Promise<any>;
    getUserWrongQuestionAnalysis(userId: number): Promise<{
        totalWrongQuestions: number;
        wrongQuestions: WrongQuestion[];
        weakKnowledgePoints: unknown[];
    }>;
    analyzeWrongReasons(userId: number, questionId: number): Promise<{
        reasons: any[];
        suggestions: string[];
    }>;
    calculateReviewSchedule(lastWrongTime: Date): Date[];
    getTodayReviewQuestions(userId: number): Promise<WrongQuestion[]>;
    getStudyStatistics(userId: number, days?: number): Promise<any[]>;
}
