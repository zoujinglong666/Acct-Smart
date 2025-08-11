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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const study_record_entity_1 = require("../../study/entities/study-record.entity");
const wrong_question_entity_1 = require("../../study/entities/wrong-question.entity");
const study_plan_entity_1 = require("../../study/entities/study-plan.entity");
const exam_record_entity_1 = require("../../exam/entities/exam-record.entity");
let User = class User extends base_entity_1.BaseEntity {
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true, comment: '微信openid' }),
    __metadata("design:type", String)
], User.prototype, "openid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '微信unionid' }),
    __metadata("design:type", String)
], User.prototype, "unionid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '用户名' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '密码' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '昵称' }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '头像URL' }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'unknown', comment: '性别' }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '手机号' }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '邮箱' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '总学习时长（分钟）' }),
    __metadata("design:type", Number)
], User.prototype, "totalStudyTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '连续学习天数' }),
    __metadata("design:type", Number)
], User.prototype, "continuousStudyDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: '最后学习日期' }),
    __metadata("design:type", Date)
], User.prototype, "lastStudyDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '总答题数' }),
    __metadata("design:type", Number)
], User.prototype, "totalQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '正确答题数' }),
    __metadata("design:type", Number)
], User.prototype, "correctQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '学习偏好设置' }),
    __metadata("design:type", Object)
], User.prototype, "preferences", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, comment: '是否激活' }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => study_record_entity_1.StudyRecord, record => record.user),
    __metadata("design:type", Array)
], User.prototype, "studyRecords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wrong_question_entity_1.WrongQuestion, wrongQuestion => wrongQuestion.user),
    __metadata("design:type", Array)
], User.prototype, "wrongQuestions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => study_plan_entity_1.StudyPlan, plan => plan.user),
    __metadata("design:type", Array)
], User.prototype, "studyPlans", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_record_entity_1.ExamRecord, record => record.user),
    __metadata("design:type", Array)
], User.prototype, "examRecords", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map