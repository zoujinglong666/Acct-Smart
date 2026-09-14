import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AiService } from '../ai/ai.service';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class AudioService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private aiService: AiService,
  ) {}

  /**
   * 生成知识点音频讲解
   */
  async generateAudioExplanation(knowledgePoint: string, content: string) {
    try {
      // 1. 先生成文字讲解
      const textExplanation = await this.aiService.generateExplanation(
        knowledgePoint,
        content
      );

      // 2. 优化文字内容，使其更适合语音播报
      const optimizedText = this.optimizeTextForSpeech(textExplanation);

      // 3. 调用文字转语音服务（这里使用腾讯云TTS作为示例）
      const audioUrl = await this.textToSpeech(optimizedText);

      return {
        textContent: textExplanation,
        optimizedText,
        audioUrl,
        duration: this.estimateAudioDuration(optimizedText)
      };
    } catch (error) {
      console.error('生成音频讲解失败:', error);
      throw BusinessException.operationError('音频生成失败', { error: error.message });
    }
  }

  /**
   * 优化文字内容，使其更适合语音播报
   */
  private optimizeTextForSpeech(text: string): string {
    return text
      // 添加适当的停顿
      .replace(/[。！？]/g, '$&，')
      // 处理数字读音
      .replace(/(\d+)/g, (match) => {
        return this.numberToChinese(parseInt(match));
      })
      // 添加语音标记
      .replace(/重点：/g, '请注意，重点内容：')
      .replace(/注意：/g, '特别注意：')
      .replace(/例如：/g, '举例来说：')
      // 处理专业术语的读音
      .replace(/会计准则/g, '会计准则')
      .replace(/资产负债表/g, '资产负债表')
      .replace(/利润表/g, '利润表');
  }

  /**
   * 数字转中文
   */
  private numberToChinese(num: number): string {
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万'];
    
    if (num === 0) return '零';
    if (num < 10) return digits[num];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (tens === 1) {
        return ones === 0 ? '十' : `十${digits[ones]}`;
      }
      return ones === 0 ? `${digits[tens]}十` : `${digits[tens]}十${digits[ones]}`;
    }
    
    return num.toString(); // 复杂数字暂时保持原样
  }

  /**
   * 文字转语音（使用腾讯云TTS）
   */
  private async textToSpeech(text: string): Promise<string> {
    try {
      // 这里应该调用实际的TTS服务
      // 为了演示，返回一个模拟的音频URL
      const mockAudioUrl = `https://tts-audio.example.com/${Date.now()}.mp3`;
      
      // 实际实现中，你需要：
      // 1. 调用腾讯云TTS API
      // 2. 上传生成的音频文件到云存储
      // 3. 返回音频文件的访问URL
      
      return mockAudioUrl;
    } catch (error) {
      console.error('TTS转换失败:', error);
      throw BusinessException.operationError('语音合成失败', { error: error.message });
    }
  }

  /**
   * 估算音频时长（秒）
   */
  private estimateAudioDuration(text: string): number {
    // 按照中文语速大约每分钟200-250字计算
    const wordsPerMinute = 220;
    const textLength = text.length;
    return Math.ceil((textLength / wordsPerMinute) * 60);
  }

  /**
   * 生成学习音频播放列表
   */
  async generateStudyPlaylist(knowledgePointIds: number[]) {
    const playlist = [];
    
    for (const pointId of knowledgePointIds) {
      try {
        // 这里应该从数据库获取知识点信息
        const mockKnowledgePoint = {
          id: pointId,
          title: `知识点${pointId}`,
          content: `这是知识点${pointId}的内容...`
        };

        const audioData = await this.generateAudioExplanation(
          mockKnowledgePoint.title,
          mockKnowledgePoint.content
        );

        playlist.push({
          id: pointId,
          title: mockKnowledgePoint.title,
          audioUrl: audioData.audioUrl,
          duration: audioData.duration,
          textContent: audioData.textContent
        });
      } catch (error) {
        console.error(`生成知识点${pointId}音频失败:`, error);
      }
    }

    return {
      playlist,
      totalDuration: playlist.reduce((sum, item) => sum + item.duration, 0),
      totalItems: playlist.length
    };
  }

  /**
   * 获取用户的音频学习记录
   */
  async getUserAudioProgress(userId: number) {
    // 这里应该从数据库获取用户的音频学习进度
    return {
      totalListenTime: 0, // 总听课时长（分钟）
      completedAudios: [], // 已完成的音频ID列表
      currentPlaylist: [], // 当前播放列表
      lastListenPosition: {} // 各音频的最后播放位置
    };
  }

  /**
   * 更新音频学习进度
   */
  async updateAudioProgress(
    userId: number, 
    audioId: number, 
    position: number, 
    duration: number
  ) {
    // 这里应该更新数据库中的学习进度
    const listenTime = Math.floor(duration / 60); // 转换为分钟
    
    // 如果播放进度超过80%，标记为已完成
    const isCompleted = (position / duration) > 0.8;
    
    return {
      success: true,
      listenTime,
      isCompleted,
      progress: Math.round((position / duration) * 100)
    };
  }
}