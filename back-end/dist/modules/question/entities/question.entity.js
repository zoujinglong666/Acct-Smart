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
exports.Question = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const knowledge_point_entity_1 = require("../../knowledge/entities/knowledge-point.entity");
const study_record_entity_1 = require("../../study/entities/study-record.entity");
const wrong_question_entity_1 = require("../../study/entities/wrong-question.entity");
let Question = class Question extends base_entity_1.BaseEntity {
};
exports.Question = Question;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', comment: '题目内容' }),
    __metadata("design:type", String)
], Question.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['single', 'multiple', 'judge', 'calculation'], nullable: true, comment: '题目类型' }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '选项' }),
    __metadata("design:type", Array)
], Question.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '正确答案' }),
    __metadata("design:type", String)
], Question.prototype, "correctAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '题目解析' }),
    __metadata("design:type", String)
], Question.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '知识点ID' }),
    __metadata("design:type", Number)
], Question.prototype, "knowledgePointId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['easy', 'medium', 'hard'], default: 'medium', comment: '难度' }),
    __metadata("design:type", String)
], Question.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '答题次数' }),
    __metadata("design:type", Number)
], Question.prototype, "answerCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '正确次数' }),
    __metadata("design:type", Number)
], Question.prototype, "correctCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '标签' }),
    __metadata("design:type", Array)
], Question.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, comment: '是否启用' }),
    __metadata("design:type", Boolean)
], Question.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '题目来源' }),
    __metadata("design:type", String)
], Question.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '年份' }),
    __metadata("design:type", Number)
], Question.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => knowledge_point_entity_1.KnowledgePoint, point => point.questions),
    (0, typeorm_1.JoinColumn)({ name: 'knowledgePointId' }),
    __metadata("design:type", knowledge_point_entity_1.KnowledgePoint)
], Question.prototype, "knowledgePoint", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => study_record_entity_1.StudyRecord, record => record.question),
    __metadata("design:type", Array)
], Question.prototype, "studyRecords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wrong_question_entity_1.WrongQuestion, wrongQuestion => wrongQuestion.question),
    __metadata("design:type", Array)
], Question.prototype, "wrongQuestions", void 0);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)('questions')
], Question);
//# sourceMappingURL=question.entity.js.map