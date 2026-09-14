import { QuestionService } from './question.service';
import { User } from '../user/entities/user.entity';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    getDailyQuestions(user: User): Promise<import("./entities/question.entity").Question[]>;
    getWrongQuestions(user: User): Promise<any[]>;
    getHighFrequencyWrongQuestions(user: User): Promise<any[]>;
    getQuestionsByKnowledgePoint(knowledgePointId: string): Promise<import("./entities/question.entity").Question[]>;
    submitAnswer(user: User, answerData: {
        questionId: string;
        userAnswer: string;
        isCorrect: boolean;
        timeSpent: number;
    }): Promise<{
        success: boolean;
        isCorrect: boolean;
        explanation: string;
    }>;
    getQuestionAnalysis(questionId: string): Promise<{
        question: import("./entities/question.entity").Question;
        analysis: string;
        difficulty: "easy" | "medium" | "hard";
        correctRate: string;
    }>;
    searchQuestions(keyword: string, difficulty?: string, knowledgePointId?: string): Promise<import("./entities/question.entity").Question[]>;
}
