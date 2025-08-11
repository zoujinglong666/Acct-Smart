import { Controller, Post, Body } from '@nestjs/common';
import { WechatService } from './wechat.service';

export class WechatLoginDto {
  code: string;
  encryptedData?: string;
  iv?: string;
}

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  /**
   * 微信登录
   */
  @Post('login')
  async login(@Body() dto: WechatLoginDto) {
    return this.wechatService.login(dto.code, dto.encryptedData, dto.iv);
  }

  /**
   * 获取微信用户信息
   */
  @Post('userinfo')
  async getUserInfo(@Body() dto: { encryptedData: string; iv: string; sessionKey: string }) {
    return this.wechatService.decryptUserInfo(dto.encryptedData, dto.iv, dto.sessionKey);
  }
}