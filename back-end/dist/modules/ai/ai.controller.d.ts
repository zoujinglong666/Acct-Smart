import { AiService } from './ai.service';
export declare class ExplanationDto {
    knowledgePoint: string;
    content: string;
}
export declare class QuestionAnalysisDto {
    question: string;
    correctAnswer: string;
    userAnswer: string;
}
export declare class AnswerQuestionDto {
    question: string;
    context?: string;
}
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateExplanation(dto: ExplanationDto): Promise<{
        explanation: string;
    }>;
    generateAnalysis(dto: QuestionAnalysisDto): Promise<{
        analysis: string;
    }>;
    answerQuestion(dto: AnswerQuestionDto): Promise<{
        answer: string;
    }>;
    getStudyAdvice(req: any): Promise<{
        advice: string;
    }>;
}
