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
exports.AiController = exports.AnswerQuestionDto = exports.QuestionAnalysisDto = exports.ExplanationDto = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class ExplanationDto {
}
exports.ExplanationDto = ExplanationDto;
class QuestionAnalysisDto {
}
exports.QuestionAnalysisDto = QuestionAnalysisDto;
class AnswerQuestionDto {
}
exports.AnswerQuestionDto = AnswerQuestionDto;
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateExplanation(dto) {
        return {
            explanation: await this.aiService.generateExplanation(dto.knowledgePoint, dto.content),
        };
    }
    async generateAnalysis(dto) {
        return {
            analysis: await this.aiService.generateQuestionAnalysis(dto.question, dto.correctAnswer, dto.userAnswer),
        };
    }
    async answerQuestion(dto) {
        return {
            answer: await this.aiService.answerQuestion(dto.question, dto.context),
        };
    }
    async getStudyAdvice(req) {
        const userId = req.user.id;
        const wrongQuestions = [];
        const studyTime = 0;
        const progress = {};
        return {
            advice: await this.aiService.generateStudyAdvice(wrongQuestions, studyTime, progress),
        };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('explanation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExplanationDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateExplanation", null);
__decorate([
    (0, common_1.Post)('analysis'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionAnalysisDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateAnalysis", null);
__decorate([
    (0, common_1.Post)('answer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnswerQuestionDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "answerQuestion", null);
__decorate([
    (0, common_1.Post)('study-advice'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getStudyAdvice", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map