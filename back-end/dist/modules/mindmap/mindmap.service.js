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
exports.MindmapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const knowledge_point_entity_1 = require("../knowledge/entities/knowledge-point.entity");
let MindmapService = class MindmapService {
    constructor(knowledgePointRepository) {
        this.knowledgePointRepository = knowledgePointRepository;
    }
    async generateMindmapData() {
        return {
            nodes: [],
            edges: []
        };
    }
    async generateMindmap(knowledgePointId) {
        return {
            id: knowledgePointId,
            title: '知识点思维导图',
            nodes: [
                { id: '1', label: '中级会计实务', x: 100, y: 100 },
                { id: '2', label: '财务管理', x: 200, y: 150 },
                { id: '3', label: '经济法', x: 300, y: 100 }
            ],
            edges: [
                { source: '1', target: '2' },
                { source: '1', target: '3' }
            ]
        };
    }
    async saveMindmap(userId, knowledgePointId, mindmapData) {
        return {
            success: true,
            message: '思维导图保存成功'
        };
    }
    async getUserMindmaps(userId) {
        return [];
    }
};
exports.MindmapService = MindmapService;
exports.MindmapService = MindmapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(knowledge_point_entity_1.KnowledgePoint)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MindmapService);
//# sourceMappingURL=mindmap.service.js.map