import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class RecognizeImageDto {
  imageBase64: string;
  generateAnalysis?: boolean;
}

@Controller('ocr')
@UseGuards(JwtAuthGuard)
export class OcrController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly aiService: AiService,
  ) {}

  /**
   * 拍照识别题目
   */
  @Post('recognize')
  async recognizeImage(@Body() dto: RecognizeImageDto) {
    try {
      // 1. OCR识别文字
      const recognizedText = await this.ocrService.recognizeText(dto.imageBase64);
      
      // 2. 解析题目结构
      const parsedQuestion = await this.ocrService.parseQuestionStructure(recognizedText);
      
      // 3. 生成AI解析（可选）
      let analysis = null;
      if (dto.generateAnalysis) {
        analysis = await this.aiService.generateQuestionAnalysis(
          parsedQuestion.question,
          '', // 暂时没有正确答案
          ''  // 暂时没有用户答案
        );
      }

      return {
        success: true,
        data: {
          originalText: recognizedText,
          parsedQuestion,
          analysis
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '识别失败'
      };
    }
  }

  /**
   * 批量识别题目
   */
  @Post('batch-recognize')
  async batchRecognize(@Body() dto: { images: string[] }) {
    const results = [];
    
    for (const imageBase64 of dto.images) {
      try {
        const recognizedText = await this.ocrService.recognizeText(imageBase64);
        const parsedQuestion = await this.ocrService.parseQuestionStructure(recognizedText);
        
        results.push({
          success: true,
          data: {
            originalText: recognizedText,
            parsedQuestion
          }
        });
      } catch (error) {
        results.push({
          success: false,
          message: error.message || '识别失败'
        });
      }
    }

    return { results };
  }
}