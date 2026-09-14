import { Repository } from 'typeorm';
import { KnowledgePoint } from './entities/knowledge-point.entity';
export declare class KnowledgeService {
    private knowledgePointRepository;
    constructor(knowledgePointRepository: Repository<KnowledgePoint>);
    getChapters(): Promise<KnowledgePoint[]>;
    getKnowledgePoint(id: number): Promise<KnowledgePoint>;
    getKnowledgePointsByChapter(chapterNumber: string): Promise<KnowledgePoint[]>;
    searchKnowledgePoints(keyword: string): Promise<KnowledgePoint[]>;
    updateStudyCount(id: number): Promise<void>;
    findAll(): Promise<KnowledgePoint[]>;
    findOne(id: number): Promise<KnowledgePoint>;
    getQuestionsByKnowledgePoint(knowledgePointId: number): Promise<import("../question/entities/question.entity").Question[]>;
    getKnowledgeTree(): Promise<any[]>;
    private buildTree;
}
