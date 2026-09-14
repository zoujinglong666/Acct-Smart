import { KnowledgeService } from './knowledge.service';
export declare class KnowledgeController {
    private readonly knowledgeService;
    constructor(knowledgeService: KnowledgeService);
    findAll(): Promise<import("./entities/knowledge-point.entity").KnowledgePoint[]>;
    findOne(id: string): Promise<import("./entities/knowledge-point.entity").KnowledgePoint>;
    getQuestionsByKnowledgePoint(id: string): Promise<import("../question/entities/question.entity").Question[]>;
    getKnowledgeTree(): Promise<any[]>;
}
