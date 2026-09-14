import { MindmapService } from './mindmap.service';
import { User } from '../user/entities/user.entity';
export declare class MindmapController {
    private readonly mindmapService;
    constructor(mindmapService: MindmapService);
    generateMindmap(knowledgePointId: string): Promise<{
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
    saveMindmap(user: User, mindmapData: {
        knowledgePointId: number;
        mindmapData: any;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserMindmaps(userId: string): Promise<any[]>;
}
