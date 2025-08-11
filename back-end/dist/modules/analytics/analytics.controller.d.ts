import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getHighFrequencyWrongQuestions(limit?: string): Promise<any>;
    getUserWrongAnalysis(req: any): Promise<{
        totalWrongQuestions: number;
        wrongQuestions: import("../study/entities/wrong-question.entity").WrongQuestion[];
        weakKnowledgePoints: unknown[];
    }>;
    getWrongReasons(req: any, questionId: string): Promise<{
        reasons: any[];
        suggestions: string[];
    }>;
    getTodayReview(req: any): Promise<import("../study/entities/wrong-question.entity").WrongQuestion[]>;
    getStudyStats(req: any, days?: string): Promise<any[]>;
}
