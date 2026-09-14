import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AudioService } from './audio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class GenerateAudioDto {
  knowledgePoint: string;
  content: string;
}

export class CreatePlaylistDto {
  knowledgePointIds: number[];
}

export class UpdateProgressDto {
  audioId: number;
  position: number;
  duration: number;
}

@Controller('audio')
@UseGuards(JwtAuthGuard)
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  /**
   * 生成知识点音频讲解
   */
  @Post('generate')
  async generateAudio(@Body() dto: GenerateAudioDto) {
    return this.audioService.generateAudioExplanation(
      dto.knowledgePoint,
      dto.content
    );
  }

  /**
   * 创建学习播放列表
   */
  @Post('playlist')
  async createPlaylist(@Body() dto: CreatePlaylistDto) {
    return this.audioService.generateStudyPlaylist(dto.knowledgePointIds);
  }

  /**
   * 获取用户音频学习进度
   */
  @Get('progress')
  async getProgress(@Request() req) {
    return this.audioService.getUserAudioProgress(req.user.id);
  }

  /**
   * 更新音频学习进度
   */
  @Post('progress')
  async updateProgress(@Request() req, @Body() dto: UpdateProgressDto) {
    return this.audioService.updateAudioProgress(
      req.user.id,
      dto.audioId,
      dto.position,
      dto.duration
    );
  }
}