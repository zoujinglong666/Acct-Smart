import { QuestionService } from './question.service';
import { User } from '../user/entities/user.entity';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    getDailyQuestions(user: User): Promise<import("./entities/question.entity").Question[]>;
    getQuestionsByKnowledgePoint(knowledgePointId: string): Promise<import("./entities/question.entity").Question[]>;
    submitAnswer(user: User, answerData: {
        questionId: string;
        userAnswer: string;
        timeSpent: number;
    }): Promise<{
        success: boolean;
        isCorrect: boolean;
        correctAnswer: string;
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
