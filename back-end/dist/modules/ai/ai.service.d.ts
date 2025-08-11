import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
export declare class AiService {
    private configService;
    private aiQueue;
    private openai;
    constructor(configService: ConfigService, aiQueue: Queue);
    generateExplanation(knowledgePoint: string, content: string): Promise<string>;
    generateQuestionAnalysis(question: string, correctAnswer: string, userAnswer: string): Promise<string>;
    answerQuestion(question: string, context?: string): Promise<string>;
    generateContentAsync(type: 'explanation' | 'analysis' | 'answer', data: any): Promise<{
        jobId: import("bull").JobId;
    }>;
    generateStudyAdvice(wrongQuestions: any[], studyTime: number, progress: any): Promise<string>;
}
