import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AiService } from '../ai/ai.service';
export declare class AudioService {
    private configService;
    private httpService;
    private aiService;
    constructor(configService: ConfigService, httpService: HttpService, aiService: AiService);
    generateAudioExplanation(knowledgePoint: string, content: string): Promise<{
        textContent: string;
        optimizedText: string;
        audioUrl: string;
        duration: number;
    }>;
    private optimizeTextForSpeech;
    private numberToChinese;
    private textToSpeech;
    private estimateAudioDuration;
    generateStudyPlaylist(knowledgePointIds: number[]): Promise<{
        playlist: any[];
        totalDuration: any;
        totalItems: number;
    }>;
    getUserAudioProgress(userId: number): Promise<{
        totalListenTime: number;
        completedAudios: any[];
        currentPlaylist: any[];
        lastListenPosition: {};
    }>;
    updateAudioProgress(userId: number, audioId: number, position: number, duration: number): Promise<{
        success: boolean;
        listenTime: number;
        isCompleted: boolean;
        progress: number;
    }>;
}
