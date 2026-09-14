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
exports.WrongQuestion = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const question_entity_1 = require("../../question/entities/question.entity");
let WrongQuestion = class WrongQuestion extends base_entity_1.BaseEntity {
};
exports.WrongQuestion = WrongQuestion;
__decorate([
    (0, typeorm_1.Column)({ comment: '用户ID' }),
    __metadata("design:type", Number)
], WrongQuestion.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '题目ID' }),
    __metadata("design:type", Number)
], WrongQuestion.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '用户答案' }),
    __metadata("design:type", String)
], WrongQuestion.prototype, "userAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '正确答案' }),
    __metadata("design:type", String)
], WrongQuestion.prototype, "correctAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '题目解析' }),
    __metadata("design:type", String)
], WrongQuestion.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1, comment: '错误次数' }),
    __metadata("design:type", Number)
], WrongQuestion.prototype, "wrongCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '最后错误时间' }),
    __metadata("design:type", Date)
], WrongQuestion.prototype, "lastWrongTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: '是否已掌握' }),
    __metadata("design:type", Boolean)
], WrongQuestion.prototype, "isMastered", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: '是否已解决' }),
    __metadata("design:type", Boolean)
], WrongQuestion.prototype, "isSolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, comment: '解决时间' }),
    __metadata("design:type", Date)
], WrongQuestion.prototype, "solvedTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '错误原因分析' }),
    __metadata("design:type", Array)
], WrongQuestion.prototype, "wrongReasons", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '复习计划' }),
    __metadata("design:type", Array)
], WrongQuestion.prototype, "reviewSchedule", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.wrongQuestions),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], WrongQuestion.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, question => question.wrongQuestions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", question_entity_1.Question)
], WrongQuestion.prototype, "question", void 0);
exports.WrongQuestion = WrongQuestion = __decorate([
    (0, typeorm_1.Entity)('wrong_questions')
], WrongQuestion);
//# sourceMappingURL=wrong-question.entity.js.map