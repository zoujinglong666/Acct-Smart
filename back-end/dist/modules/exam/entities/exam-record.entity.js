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
exports.ExamRecord = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const exam_paper_entity_1 = require("./exam-paper.entity");
let ExamRecord = class ExamRecord extends base_entity_1.BaseEntity {
};
exports.ExamRecord = ExamRecord;
__decorate([
    (0, typeorm_1.Column)({ comment: '用户ID' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '试卷ID' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "examPaperId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', comment: '用户答案' }),
    __metadata("design:type", Array)
], ExamRecord.prototype, "userAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '总分' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '用户得分' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "userScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '正确题目数' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "correctCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '总题目数' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "totalCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '考试用时（秒）' }),
    __metadata("design:type", Number)
], ExamRecord.prototype, "timeUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['completed', 'timeout', 'abandoned'], comment: '考试状态' }),
    __metadata("design:type", String)
], ExamRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '各题型得分' }),
    __metadata("design:type", Object)
], ExamRecord.prototype, "scoreByType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', comment: '开始时间' }),
    __metadata("design:type", Date)
], ExamRecord.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, comment: '结束时间' }),
    __metadata("design:type", Date)
], ExamRecord.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ExamRecord.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exam_paper_entity_1.ExamPaper, paper => paper.examRecords),
    (0, typeorm_1.JoinColumn)({ name: 'examPaperId' }),
    __metadata("design:type", exam_paper_entity_1.ExamPaper)
], ExamRecord.prototype, "examPaper", void 0);
exports.ExamRecord = ExamRecord = __decorate([
    (0, typeorm_1.Entity)('exam_records')
], ExamRecord);
//# sourceMappingURL=exam-record.entity.js.map