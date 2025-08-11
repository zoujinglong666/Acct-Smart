import { Repository } from 'typeorm';
import { KnowledgePoint } from '../knowledge/entities/knowledge-point.entity';
export declare class MindmapService {
    private knowledgePointRepository;
    constructor(knowledgePointRepository: Repository<KnowledgePoint>);
    generateMindmapData(): Promise<{
        nodes: any[];
        edges: any[];
    }>;
    generateMindmap(knowledgePointId: number): Promise<{
        id: number;
        title: string;
        nodes: {
            id: string;
            label: string;
            x: number;
            y: number;
        }[];
        edges: {
            source: string;
            target: string;
        }[];
    }>;
    saveMindmap(userId: number, knowledgePointId: number, mindmapData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserMindmaps(userId: number): Promise<any[]>;
}
