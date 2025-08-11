import { OcrService } from './ocr.service';
import { AiService } from '../ai/ai.service';
export declare class RecognizeImageDto {
    imageBase64: string;
    generateAnalysis?: boolean;
}
export declare class OcrController {
    private readonly ocrService;
    private readonly aiService;
    constructor(ocrService: OcrService, aiService: AiService);
    recognizeImage(dto: RecognizeImageDto): Promise<{
        success: boolean;
        data: {
            originalText: string;
            parsedQuestion: any;
            analysis: any;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    batchRecognize(dto: {
        images: string[];
    }): Promise<{
        results: any[];
    }>;
}
