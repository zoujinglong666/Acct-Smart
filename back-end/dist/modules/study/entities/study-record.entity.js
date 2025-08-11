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
exports.StudyRecord = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const question_entity_1 = require("../../question/entities/question.entity");
let StudyRecord = class StudyRecord extends base_entity_1.BaseEntity {
};
exports.StudyRecord = StudyRecord;
__decorate([
    (0, typeorm_1.Column)({ comment: '用户ID' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '题目ID' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '用户答案' }),
    __metadata("design:type", String)
], StudyRecord.prototype, "userAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: '是否正确' }),
    __metadata("design:type", Boolean)
], StudyRecord.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '答题用时（秒）' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "timeSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['practice', 'exam', 'daily', 'knowledge'], default: 'practice', comment: '学习类型' }),
    __metadata("design:type", String)
], StudyRecord.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '目标ID（题目ID或知识点ID）' }),
    __metadata("design:type", String)
], StudyRecord.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '学习时长（分钟）' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "studyTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '完成题目数' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "completedQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '正确率（百分比）' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "accuracy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE', comment: '学习日期' }),
    __metadata("design:type", Date)
], StudyRecord.prototype, "studyDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '学习进度（百分比）' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '考试记录ID' }),
    __metadata("design:type", Number)
], StudyRecord.prototype, "examRecordId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.studyRecords),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], StudyRecord.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, question => question.studyRecords, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", question_entity_1.Question)
], StudyRecord.prototype, "question", void 0);
exports.StudyRecord = StudyRecord = __decorate([
    (0, typeorm_1.Entity)('study_records')
], StudyRecord);
//# sourceMappingURL=study-record.entity.js.map