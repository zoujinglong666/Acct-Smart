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
exports.AudioController = exports.UpdateProgressDto = exports.CreatePlaylistDto = exports.GenerateAudioDto = void 0;
const common_1 = require("@nestjs/common");
const audio_service_1 = require("./audio.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class GenerateAudioDto {
}
exports.GenerateAudioDto = GenerateAudioDto;
class CreatePlaylistDto {
}
exports.CreatePlaylistDto = CreatePlaylistDto;
class UpdateProgressDto {
}
exports.UpdateProgressDto = UpdateProgressDto;
let AudioController = class AudioController {
    constructor(audioService) {
        this.audioService = audioService;
    }
    async generateAudio(dto) {
        return this.audioService.generateAudioExplanation(dto.knowledgePoint, dto.content);
    }
    async createPlaylist(dto) {
        return this.audioService.generateStudyPlaylist(dto.knowledgePointIds);
    }
    async getProgress(req) {
        return this.audioService.getUserAudioProgress(req.user.id);
    }
    async updateProgress(req, dto) {
        return this.audioService.updateAudioProgress(req.user.id, dto.audioId, dto.position, dto.duration);
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateAudioDto]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "generateAudio", null);
__decorate([
    (0, common_1.Post)('playlist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePlaylistDto]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "createPlaylist", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)('progress'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProgressDto]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "updateProgress", null);
exports.AudioController = AudioController = __decorate([
    (0, common_1.Controller)('audio'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [audio_service_1.AudioService])
], AudioController);
//# sourceMappingURL=audio.controller.js.map