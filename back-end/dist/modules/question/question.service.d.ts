import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
export declare class QuestionService {
    private questionRepository;
    constructor(questionRepository: Repository<Question>);
    findAll(page?: number, limit?: number, filters?: any): Promise<{
        data: Question[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Question>;
    getRandomQuestions(count?: number, filters?: any): Promise<Question[]>;
    updateQuestionStats(id: number, isCorrect: boolean): Promise<void>;
    saveOcrQuestion(questionData: any): Promise<Question>;
    getDailyQuestions(userId: number): Promise<Question[]>;
    getWrongQuestions(userId: number): Promise<any[]>;
    getHighFrequencyWrongQuestions(userId: number): Promise<any[]>;
    getQuestionsByKnowledgePoint(knowledgePointId: string): Promise<Question[]>;
    submitAnswer(userId: number, questionId: string, userAnswer: string, isCorrect: boolean, timeSpent: number): Promise<{
        success: boolean;
        isCorrect: boolean;
        explanation: string;
    }>;
    getQuestionAnalysis(questionId: string): Promise<{
        question: Question;
        analysis: string;
        difficulty: "easy" | "medium" | "hard";
        correctRate: string;
    }>;
    searchQuestions(keyword: string, difficulty?: string, knowledgePointId?: string): Promise<Question[]>;
}
