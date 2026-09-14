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
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const question_service_1 = require("./question.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
let QuestionController = class QuestionController {
    constructor(questionService) {
        this.questionService = questionService;
    }
    async getDailyQuestions(user) {
        return this.questionService.getDailyQuestions(user.id);
    }
    async getWrongQuestions(user) {
        return this.questionService.getWrongQuestions(user.id);
    }
    async getHighFrequencyWrongQuestions(user) {
        return this.questionService.getHighFrequencyWrongQuestions(user.id);
    }
    async getQuestionsByKnowledgePoint(knowledgePointId) {
        return this.questionService.getQuestionsByKnowledgePoint(knowledgePointId);
    }
    async submitAnswer(user, answerData) {
        return this.questionService.submitAnswer(user.id, answerData.questionId, answerData.userAnswer, answerData.isCorrect, answerData.timeSpent);
    }
    async getQuestionAnalysis(questionId) {
        return this.questionService.getQuestionAnalysis(questionId);
    }
    async searchQuestions(keyword, difficulty, knowledgePointId) {
        return this.questionService.searchQuestions(keyword, difficulty, knowledgePointId);
    }
};
exports.QuestionController = QuestionController;
__decorate([
    (0, common_1.Get)('daily'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getDailyQuestions", null);
__decorate([
    (0, common_1.Get)('wrong'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getWrongQuestions", null);
__decorate([
    (0, common_1.Get)('high-frequency'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getHighFrequencyWrongQuestions", null);
__decorate([
    (0, common_1.Get)('by-knowledge-point/:knowledgePointId'),
    __param(0, (0, common_1.Param)('knowledgePointId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getQuestionsByKnowledgePoint", null);
__decorate([
    (0, common_1.Post)('answer'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Get)('analysis/:questionId'),
    __param(0, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getQuestionAnalysis", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('keyword')),
    __param(1, (0, common_1.Query)('difficulty')),
    __param(2, (0, common_1.Query)('knowledgePointId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "searchQuestions", null);
exports.QuestionController = QuestionController = __decorate([
    (0, common_1.Controller)('questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [question_service_1.QuestionService])
], QuestionController);
//# sourceMappingURL=question.controller.js.map