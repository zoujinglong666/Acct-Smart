import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class ExplanationDto {
  knowledgePoint: string;
  content: string;
}

export class QuestionAnalysisDto {
  question: string;
  correctAnswer: string;
  userAnswer: string;
}

export class AnswerQuestionDto {
  question: string;
  context?: string;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * 生成知识点讲解
   */
  @Post('explanation')
  async generateExplanation(@Body() dto: ExplanationDto) {
    return {
      explanation: await this.aiService.generateExplanation(
        dto.knowledgePoint,
        dto.content,
      ),
    };
  }

  /**
   * 生成题目解析
   */
  @Post('analysis')
  async generateAnalysis(@Body() dto: QuestionAnalysisDto) {
    return {
      analysis: await this.aiService.generateQuestionAnalysis(
        dto.question,
        dto.correctAnswer,
        dto.userAnswer,
      ),
    };
  }

  /**
   * AI答疑
   */
  @Post('answer')
  async answerQuestion(@Body() dto: AnswerQuestionDto) {
    return {
      answer: await this.aiService.answerQuestion(dto.question, dto.context),
    };
  }

  /**
   * 获取学习建议
   */
  @Post('study-advice')
  async getStudyAdvice(@Request() req) {
    const userId = req.user.id;
    // 这里需要获取用户的错题和学习数据
    // 为了简化，使用模拟数据
    const wrongQuestions = [];
    const studyTime = 0;
    const progress = {};

    return {
      advice: await this.aiService.generateStudyAdvice(
        wrongQuestions,
        studyTime,
        progress,
      ),
    };
  }
}