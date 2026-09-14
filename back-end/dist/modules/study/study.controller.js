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
let StudyController = class StudyController {
    constructor(studyService) {
        this.studyService = studyService;
    }
    async getStudyRecords(user) {
        return this.studyService.getStudyRecords(user.id);
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
    async getTodayStatus(user) {
        return this.studyService.getTodayStatus(user.id);
    }
};
exports.StudyController = StudyController;
__decorate([
    (0, common_1.Get)('records'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getStudyRecords", null);
__decorate([
    (0, common_1.Get)('wrong-questions'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getWrongQuestions", null);
__decorate([
    (0, common_1.Post)('wrong-question'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "addWrongQuestion", null);
__decorate([
    (0, common_1.Patch)('wrong-question/:id/mastered'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "markWrongQuestionMastered", null);
__decorate([
    (0, common_1.Delete)('wrong-question/:id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "deleteWrongQuestion", null);
__decorate([
    (0, common_1.Get)('today-status'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyController.prototype, "getTodayStatus", null);
exports.StudyController = StudyController = __decorate([
    (0, common_1.Controller)('study'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [study_service_1.StudyService])
], StudyController);
//# sourceMappingURL=study.controller.js.map