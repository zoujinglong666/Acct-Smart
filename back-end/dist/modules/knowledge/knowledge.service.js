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
exports.KnowledgeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const knowledge_point_entity_1 = require("./entities/knowledge-point.entity");
const business_exception_1 = require("../../common/exceptions/business.exception");
let KnowledgeService = class KnowledgeService {
    constructor(knowledgePointRepository) {
        this.knowledgePointRepository = knowledgePointRepository;
    }
    async getChapters() {
        return this.knowledgePointRepository
            .createQueryBuilder('kp')
            .where('kp.parentId IS NULL')
            .orderBy('kp.sortOrder', 'ASC')
            .getMany();
    }
    async getKnowledgePoint(id) {
        const point = await this.knowledgePointRepository.findOne({
            where: { id },
            relations: ['children', 'questions']
        });
        if (!point) {
            throw business_exception_1.BusinessException.notFoundError('知识点不存在');
        }
        return point;
    }
    async getKnowledgePointsByChapter(chapterNumber) {
        return this.knowledgePointRepository
            .createQueryBuilder('kp')
            .where('kp.chapterNumber LIKE :chapter', { chapter: `${chapterNumber}%` })
            .orderBy('kp.sortOrder', 'ASC')
            .getMany();
    }
    async searchKnowledgePoints(keyword) {
        return this.knowledgePointRepository
            .createQueryBuilder('kp')
            .where('kp.title LIKE :keyword OR kp.content LIKE :keyword', {
            keyword: `%${keyword}%`
        })
            .orderBy('kp.studyCount', 'DESC')
            .take(20)
            .getMany();
    }
    async updateStudyCount(id) {
        await this.knowledgePointRepository
            .createQueryBuilder()
            .update(knowledge_point_entity_1.KnowledgePoint)
            .set({ studyCount: () => 'study_count + 1' })
            .where('id = :id', { id })
            .execute();
    }
    async findAll() {
        return this.knowledgePointRepository.find({
            order: { sortOrder: 'ASC' }
        });
    }
    async findOne(id) {
        const point = await this.knowledgePointRepository.findOne({
            where: { id },
            relations: ['children', 'questions']
        });
        if (!point) {
            throw business_exception_1.BusinessException.notFoundError('知识点不存在');
        }
        return point;
    }
    async getQuestionsByKnowledgePoint(knowledgePointId) {
        const point = await this.knowledgePointRepository.findOne({
            where: { id: knowledgePointId },
            relations: ['questions']
        });
        if (!point) {
            throw business_exception_1.BusinessException.notFoundError('知识点不存在');
        }
        return point.questions;
    }
    async getKnowledgeTree() {
        const knowledgePoints = await this.knowledgePointRepository.find({
            order: { sortOrder: 'ASC' },
        });
        const tree = this.buildTree(knowledgePoints);
        return tree;
    }
    buildTree(points, parentId = null) {
        return points
            .filter(point => point.parentId === parentId)
            .map(point => ({
            ...point,
            children: this.buildTree(points, point.id)
        }));
    }
};
exports.KnowledgeService = KnowledgeService;
exports.KnowledgeService = KnowledgeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(knowledge_point_entity_1.KnowledgePoint)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KnowledgeService);
//# sourceMappingURL=knowledge.service.js.map