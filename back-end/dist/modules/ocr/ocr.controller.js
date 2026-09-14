"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrController = exports.RecognizeImageDto = void 0;
const common_1 = require("@nestjs/common");
const ocr_service_1 = require("./ocr.service");
const ai_service_1 = require("../ai/ai.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class RecognizeImageDto {
}
exports.RecognizeImageDto = RecognizeImageDto;
let OcrController = class OcrController {
    constructor(ocrService, aiService) {
        this.ocrService = ocrService;
        this.aiService = aiService;
    }
    async recognizeImage(dto) {
        try {
            const recognizedText = await this.ocrService.recognizeText(dto.imageBase64);
            const parsedQuestion = await this.ocrService.parseQuestionStructure(recognizedText);
            let analysis = null;
            if (dto.generateAnalysis) {
                analysis = await this.aiService.generateQuestionAnalysis(parsedQuestion.question, '', '');
            }
            return {
                success: true,
                data: {
                    originalText: recognizedText,
                    parsedQuestion,
                    analysis
                }
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || '识别失败'
            };
        }
    }
    async batchRecognize(dto) {
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
            }
            catch (error) {
                results.push({
                    success: false,
                    message: error.message || '识别失败'
                });
            }
        }
        return { results };
    }
};
exports.OcrController = OcrController;
__decorate([
    (0, common_1.Post)('recognize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecognizeImageDto]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "recognizeImage", null);
__decorate([
    (0, common_1.Post)('batch-recognize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "batchRecognize", null);
exports.OcrController = OcrController = __decorate([
    (0, common_1.Controller)('ocr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ocr_service_1.OcrService,
        ai_service_1.AiService])
], OcrController);
//# sourceMappingURL=ocr.controller.js.map