import { ExamService } from './exam.service';
import { User } from '../user/entities/user.entity';
export declare class ExamController {
    private readonly examService;
    constructor(examService: ExamService);
    getExamPapers(): Promise<import("./entities/exam-paper.entity").ExamPaper[]>;
    generateExamPaper(user: User, examConfig: {
        type: string;
        questionCount: number;
        timeLimit: number;
        knowledgePointIds?: number[];
    }): Promise<{
        questions: import("../question/entities/question.entity").Question[];
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
        examRecords: import("./entities/exam-record.entity").ExamRecord[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    submitExam(user: User, examData: {
        paperId: number;
        answers: any[];
        timeSpent: number;
    }): Promise<{
        recordId: number;
        score: number;
        passed: boolean;
        timeSpent: number;
    }>;
    getExamRecords(user: User): Promise<import("./entities/exam-record.entity").ExamRecord[]>;
    getExamAnalysis(recordId: string): Promise<{
        record: import("./entities/exam-record.entity").ExamRecord;
        analysis: {
            totalQuestions: number;
            correctAnswers: number;
            accuracy: number;
            timeEfficiency: number;
            weakPoints: any[];
        };
    }>;
}
