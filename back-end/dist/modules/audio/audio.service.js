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
exports.AudioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const ai_service_1 = require("../ai/ai.service");
const business_exception_1 = require("../../common/exceptions/business.exception");
let AudioService = class AudioService {
    constructor(configService, httpService, aiService) {
        this.configService = configService;
        this.httpService = httpService;
        this.aiService = aiService;
    }
    async generateAudioExplanation(knowledgePoint, content) {
        try {
            const textExplanation = await this.aiService.generateExplanation(knowledgePoint, content);
            const optimizedText = this.optimizeTextForSpeech(textExplanation);
            const audioUrl = await this.textToSpeech(optimizedText);
            return {
                textContent: textExplanation,
                optimizedText,
                audioUrl,
                duration: this.estimateAudioDuration(optimizedText)
            };
        }
        catch (error) {
            console.error('生成音频讲解失败:', error);
            throw business_exception_1.BusinessException.operationError('音频生成失败', { error: error.message });
        }
    }
    optimizeTextForSpeech(text) {
        return text
            .replace(/[。！？]/g, '$&，')
            .replace(/(\d+)/g, (match) => {
            return this.numberToChinese(parseInt(match));
        })
            .replace(/重点：/g, '请注意，重点内容：')
            .replace(/注意：/g, '特别注意：')
            .replace(/例如：/g, '举例来说：')
            .replace(/会计准则/g, '会计准则')
            .replace(/资产负债表/g, '资产负债表')
            .replace(/利润表/g, '利润表');
    }
    numberToChinese(num) {
        const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const units = ['', '十', '百', '千', '万'];
        if (num === 0)
            return '零';
        if (num < 10)
            return digits[num];
        if (num < 100) {
            const tens = Math.floor(num / 10);
            const ones = num % 10;
            if (tens === 1) {
                return ones === 0 ? '十' : `十${digits[ones]}`;
            }
            return ones === 0 ? `${digits[tens]}十` : `${digits[tens]}十${digits[ones]}`;
        }
        return num.toString();
    }
    async textToSpeech(text) {
        try {
            const mockAudioUrl = `https://tts-audio.example.com/${Date.now()}.mp3`;
            return mockAudioUrl;
        }
        catch (error) {
            console.error('TTS转换失败:', error);
            throw business_exception_1.BusinessException.operationError('语音合成失败', { error: error.message });
        }
    }
    estimateAudioDuration(text) {
        const wordsPerMinute = 220;
        const textLength = text.length;
        return Math.ceil((textLength / wordsPerMinute) * 60);
    }
    async generateStudyPlaylist(knowledgePointIds) {
        const playlist = [];
        for (const pointId of knowledgePointIds) {
            try {
                const mockKnowledgePoint = {
                    id: pointId,
                    title: `知识点${pointId}`,
                    content: `这是知识点${pointId}的内容...`
                };
                const audioData = await this.generateAudioExplanation(mockKnowledgePoint.title, mockKnowledgePoint.content);
                playlist.push({
                    id: pointId,
                    title: mockKnowledgePoint.title,
                    audioUrl: audioData.audioUrl,
                    duration: audioData.duration,
                    textContent: audioData.textContent
                });
            }
            catch (error) {
                console.error(`生成知识点${pointId}音频失败:`, error);
            }
        }
        return {
            playlist,
            totalDuration: playlist.reduce((sum, item) => sum + item.duration, 0),
            totalItems: playlist.length
        };
    }
    async getUserAudioProgress(userId) {
        return {
            totalListenTime: 0,
            completedAudios: [],
            currentPlaylist: [],
            lastListenPosition: {}
        };
    }
    async updateAudioProgress(userId, audioId, position, duration) {
        const listenTime = Math.floor(duration / 60);
        const isCompleted = (position / duration) > 0.8;
        return {
            success: true,
            listenTime,
            isCompleted,
            progress: Math.round((position / duration) * 100)
        };
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        ai_service_1.AiService])
], AudioService);
//# sourceMappingURL=audio.service.js.map