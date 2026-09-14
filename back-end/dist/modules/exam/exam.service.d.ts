import { Repository } from 'typeorm';
import { ExamPaper } from './entities/exam-paper.entity';
import { ExamRecord } from './entities/exam-record.entity';
import { Question } from '../question/entities/question.entity';
export declare class ExamService {
    private examPaperRepository;
    private examRecordRepository;
    private questionRepository;
    constructor(examPaperRepository: Repository<ExamPaper>, examRecordRepository: Repository<ExamRecord>, questionRepository: Repository<Question>);
    getExamPapers(): Promise<ExamPaper[]>;
    generateExamPaper(userId: number, examConfig: any): Promise<{
        questions: Question[];
        title: string;
        description: string;
        type: "mock" | "sprint" | "daily";
        questionIds: number[];
        duration: number;
        totalScore: number;
        passScore: number;
        questionDistribution: {
            single: number;
            multiple: number;
            judge: number;
            calculation: number;
        };
        isActive: boolean;
        instructions: string[];
        examRecords: ExamRecord[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    submitExam(userId: number, paperId: number, answers: any[], timeSpent: number): Promise<{
        recordId: number;
        score: number;
        passed: boolean;
        timeSpent: number;
    }>;
    getExamRecords(userId: number): Promise<ExamRecord[]>;
    getExamAnalysis(recordId: number): Promise<{
        record: ExamRecord;
        analysis: {
            totalQuestions: number;
            correctAnswers: number;
            accuracy: number;
            timeEfficiency: number;
            weakPoints: any[];
        };
    }>;
    private calculateScore;
    getExamStats(userId: number): Promise<{
        totalExams: number;
        passedExams: number;
        passRate: string;
        averageScore: string;
        bestScore: number;
    }>;
    generateMockExam(userId: number, config: any): Promise<{
        questions: Question[];
        title: string;
        description: string;
        type: "mock" | "sprint" | "daily";
        questionIds: number[];
        duration: number;
        totalScore: number;
        passScore: number;
        questionDistribution: {
            single: number;
            multiple: number;
            judge: number;
            calculation: number;
        };
        isActive: boolean;
        instructions: string[];
        examRecords: ExamRecord[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
