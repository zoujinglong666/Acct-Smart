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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlan = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let StudyPlan = class StudyPlan extends base_entity_1.BaseEntity {
};
exports.StudyPlan = StudyPlan;
__decorate([
    (0, typeorm_1.Column)({ comment: '用户ID' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '计划名称' }),
    __metadata("design:type", String)
], StudyPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '计划标题' }),
    __metadata("design:type", String)
], StudyPlan.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '计划描述' }),
    __metadata("design:type", String)
], StudyPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', comment: '开始日期' }),
    __metadata("design:type", Date)
], StudyPlan.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', comment: '结束日期' }),
    __metadata("design:type", Date)
], StudyPlan.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: '目标日期' }),
    __metadata("design:type", Date)
], StudyPlan.prototype, "targetDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 60, comment: '每日学习时间（分钟）' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "dailyTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '学习科目' }),
    __metadata("design:type", Array)
], StudyPlan.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', comment: '学习内容配置' }),
    __metadata("design:type", Object)
], StudyPlan.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['active', 'completed', 'paused', 'draft'], default: 'active', comment: '计划状态' }),
    __metadata("design:type", String)
], StudyPlan.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '完成进度（百分比）' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '总天数' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "totalDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '已学习天数' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "studiedDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, comment: '完成时间' }),
    __metadata("design:type", Date)
], StudyPlan.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '学习统计' }),
    __metadata("design:type", Object)
], StudyPlan.prototype, "statistics", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.studyPlans),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], StudyPlan.prototype, "user", void 0);
exports.StudyPlan = StudyPlan = __decorate([
    (0, typeorm_1.Entity)('study_plans')
], StudyPlan);
//# sourceMappingURL=study-plan.entity.js.map