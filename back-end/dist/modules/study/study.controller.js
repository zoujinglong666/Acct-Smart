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
exports.StudyController = void 0;
const common_1 = require("@nestjs/common");
const study_service_1 = require("./study.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
let StudyController = class StudyController {
    constructor(studyService) {
        this.studyService = studyService;
    }
    async getStudyRecords(user) {
        return this.studyService.getStudyRecords(user.id);
    }
    async createStudyRecord(user, recordData) {
        return this.studyService.createStudyRecord(user.id, recordData);
    }
    async getWrongQuestions(user) {
        return this.studyService.getWrongQuestions(user.id);
    }
    async addWrongQuestion(user, wrongQuestionData) {
        return this.studyService.addWrongQuestion(user.id, wrongQuestionData);
    }
    async markWrongQuestionMastered(user, id) {
        return this.studyService.markWrongQuestionMastered(user.id, parseInt(id));
    }
    async deleteWrongQuestion(user, id) {
        return this.studyService.deleteWrongQuestion(user.id, parseInt(id));
    }
    async getStudyPlans(user) {
        return this.studyService.getStudyPlans(user.id);
    }
    async createStudyPlan(user, planData) {
        return this.studyService.createStudyPlan(user.id, planData);
    }
    async updateStudyPlan(user, id, planData) {
        return this.studyService.updateStudyPlan(user.id, parseInt(id), planData);
    }
    async completeStudyPlan(user, id) {
        return this.studyService.completeStudyPlan(user.id, parseInt(id));
    }
    async getTodayStatus(user) {
        return this.studyService.getTodayStatus(user.id);
    }
    async saveDailyRecord(user, recordData) {
        return this.studyService.saveDailyRecord(user.id, recordData);
    }
};
exports.StudyController = StudyController;
__decorate([
    (0, common_1.Get)('records'),
    (0, swagger_1.ApiOperation)({ summary: '获取学习记录' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getStudyRecords", null);
__decorate([
    (0, common_1.Post)('record'),
    (0, swagger_1.ApiOperation)({ summary: '创建学习记录' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "createStudyRecord", null);
__decorate([
    (0, common_1.Get)('wrong-questions'),
    (0, swagger_1.ApiOperation)({ summary: '获取错题本' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getWrongQuestions", null);
__decorate([
    (0, common_1.Post)('wrong-question'),
    (0, swagger_1.ApiOperation)({ summary: '添加错题' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "addWrongQuestion", null);
__decorate([
    (0, common_1.Patch)('wrong-question/:id/mastered'),
    (0, swagger_1.ApiOperation)({ summary: '标记错题已掌握' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "markWrongQuestionMastered", null);
__decorate([
    (0, common_1.Delete)('wrong-question/:id'),
    (0, swagger_1.ApiOperation)({ summary: '删除错题' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "deleteWrongQuestion", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: '获取学习计划' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getStudyPlans", null);
__decorate([
    (0, common_1.Post)('plan'),
    (0, swagger_1.ApiOperation)({ summary: '创建学习计划' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "createStudyPlan", null);
__decorate([
    (0, common_1.Patch)('plan/:id'),
    (0, swagger_1.ApiOperation)({ summary: '更新学习计划' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "updateStudyPlan", null);
__decorate([
    (0, common_1.Post)('plan/:id/complete'),
    (0, swagger_1.ApiOperation)({ summary: '完成学习计划' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "completeStudyPlan", null);
__decorate([
    (0, common_1.Get)('today-status'),
    (0, swagger_1.ApiOperation)({ summary: '获取今日学习状态' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getTodayStatus", null);
__decorate([
    (0, common_1.Post)('daily-record'),
    (0, swagger_1.ApiOperation)({ summary: '保存每日学习记录' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "saveDailyRecord", null);
exports.StudyController = StudyController = __decorate([
    (0, swagger_1.ApiTags)('学习管理'),
    (0, common_1.Controller)('study'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [study_service_1.StudyService])
], StudyController);
//# sourceMappingURL=study.controller.js.map