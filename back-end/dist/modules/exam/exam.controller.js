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
exports.ExamController = void 0;
const common_1 = require("@nestjs/common");
const exam_service_1 = require("./exam.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
let ExamController = class ExamController {
    constructor(examService) {
        this.examService = examService;
    }
    async getExamPapers() {
        return this.examService.getExamPapers();
    }
    async generateExamPaper(user, examConfig) {
        return this.examService.generateExamPaper(user.id, examConfig);
    }
    async submitExam(user, examData) {
        return this.examService.submitExam(user.id, examData.paperId, examData.answers, examData.timeSpent);
    }
    async getExamRecords(user) {
        return this.examService.getExamRecords(user.id);
    }
    async getExamAnalysis(recordId) {
        return this.examService.getExamAnalysis(+recordId);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.Get)('papers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getExamPapers", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "generateExamPaper", null);
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "submitExam", null);
__decorate([
    (0, common_1.Get)('records'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getExamRecords", null);
__decorate([
    (0, common_1.Get)('analysis/:recordId'),
    __param(0, (0, common_1.Param)('recordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getExamAnalysis", null);
exports.ExamController = ExamController = __decorate([
    (0, common_1.Controller)('exam'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [exam_service_1.ExamService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map