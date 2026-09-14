import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { StudyRecord } from '../study/entities/study-record.entity';
import { WrongQuestion } from '../study/entities/wrong-question.entity';
import { UserService } from '../user/user.service';
export declare class QuestionService {
    private questionRepository;
    private studyRecordRepository;
    private wrongQuestionRepository;
    private userService;
    constructor(questionRepository: Repository<Question>, studyRecordRepository: Repository<StudyRecord>, wrongQuestionRepository: Repository<WrongQuestion>, userService: UserService);
    getDailyQuestions(userId: number): Promise<Question[]>;
    getRandomQuestions(count?: number, filters?: any): Promise<Question[]>;
    getQuestionsByKnowledgePoint(knowledgePointId: string): Promise<Question[]>;
    submitAnswer(userId: number, questionId: string, userAnswer: string, timeSpent: number): Promise<{
        success: boolean;
        isCorrect: boolean;
        correctAnswer: string;
        explanation: string;
    }>;
    private checkAnswer;
    private upsertWrongQuestion;
    updateQuestionStats(id: number, isCorrect: boolean): Promise<void>;
    getQuestionAnalysis(questionId: string): Promise<{
        question: Question;
        analysis: string;
        difficulty: "easy" | "medium" | "hard";
        correctRate: string;
    }>;
    searchQuestions(keyword: string, difficulty?: string, knowledgePointId?: string): Promise<Question[]>;
}
