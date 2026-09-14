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
exports.ExamPaper = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const exam_record_entity_1 = require("./exam-record.entity");
let ExamPaper = class ExamPaper extends base_entity_1.BaseEntity {
};
exports.ExamPaper = ExamPaper;
__decorate([
    (0, typeorm_1.Column)({ comment: '试卷名称' }),
    __metadata("design:type", String)
], ExamPaper.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', comment: '试卷描述' }),
    __metadata("design:type", String)
], ExamPaper.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['mock', 'sprint', 'daily'], comment: '试卷类型' }),
    __metadata("design:type", String)
], ExamPaper.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '题目ID列表' }),
    __metadata("design:type", Array)
], ExamPaper.prototype, "questionIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '考试时长（分钟）' }),
    __metadata("design:type", Number)
], ExamPaper.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '总分' }),
    __metadata("design:type", Number)
], ExamPaper.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '及格分数' }),
    __metadata("design:type", Number)
], ExamPaper.prototype, "passScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '题型分布' }),
    __metadata("design:type", Object)
], ExamPaper.prototype, "questionDistribution", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, comment: '是否启用' }),
    __metadata("design:type", Boolean)
], ExamPaper.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '考试说明' }),
    __metadata("design:type", Array)
], ExamPaper.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_record_entity_1.ExamRecord, record => record.examPaper),
    __metadata("design:type", Array)
], ExamPaper.prototype, "examRecords", void 0);
exports.ExamPaper = ExamPaper = __decorate([
    (0, typeorm_1.Entity)('exam_papers')
], ExamPaper);
//# sourceMappingURL=exam-paper.entity.js.map