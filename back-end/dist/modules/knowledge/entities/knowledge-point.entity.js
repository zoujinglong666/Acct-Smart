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
exports.KnowledgePoint = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const question_entity_1 = require("../../question/entities/question.entity");
let KnowledgePoint = class KnowledgePoint extends base_entity_1.BaseEntity {
};
exports.KnowledgePoint = KnowledgePoint;
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '知识点名称' }),
    __metadata("design:type", String)
], KnowledgePoint.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', comment: '知识点内容' }),
    __metadata("design:type", String)
], KnowledgePoint.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '父级知识点ID' }),
    __metadata("design:type", Number)
], KnowledgePoint.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '章节编号' }),
    __metadata("design:type", String)
], KnowledgePoint.prototype, "chapterNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0, comment: '排序权重' }),
    __metadata("design:type", Number)
], KnowledgePoint.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['basic', 'important', 'difficult'], default: 'basic', comment: '重要程度' }),
    __metadata("design:type", String)
], KnowledgePoint.prototype, "importance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '知识点标签' }),
    __metadata("design:type", Array)
], KnowledgePoint.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '学习人数' }),
    __metadata("design:type", Number)
], KnowledgePoint.prototype, "studyCount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => KnowledgePoint, point => point.children),
    (0, typeorm_1.JoinColumn)({ name: 'parentId' }),
    __metadata("design:type", KnowledgePoint)
], KnowledgePoint.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => KnowledgePoint, point => point.parent),
    __metadata("design:type", Array)
], KnowledgePoint.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_entity_1.Question, question => question.knowledgePoint),
    __metadata("design:type", Array)
], KnowledgePoint.prototype, "questions", void 0);
exports.KnowledgePoint = KnowledgePoint = __decorate([
    (0, typeorm_1.Entity)('knowledge_points')
], KnowledgePoint);
//# sourceMappingURL=knowledge-point.entity.js.map