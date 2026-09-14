import { AudioService } from './audio.service';
export declare class GenerateAudioDto {
    knowledgePoint: string;
    content: string;
}
export declare class CreatePlaylistDto {
    knowledgePointIds: number[];
}
export declare class UpdateProgressDto {
    audioId: number;
    position: number;
    duration: number;
}
export declare class AudioController {
    private readonly audioService;
    constructor(audioService: AudioService);
    generateAudio(dto: GenerateAudioDto): Promise<{
        textContent: string;
        optimizedText: string;
        audioUrl: string;
        duration: number;
    }>;
    createPlaylist(dto: CreatePlaylistDto): Promise<{
        playlist: any[];
        totalDuration: any;
        totalItems: number;
    }>;
    getProgress(req: any): Promise<{
        totalListenTime: number;
        completedAudios: any[];
        currentPlaylist: any[];
        lastListenPosition: {};
    }>;
    updateProgress(req: any, dto: UpdateProgressDto): Promise<{
        success: boolean;
        listenTime: number;
        isCompleted: boolean;
        progress: number;
    }>;
}
