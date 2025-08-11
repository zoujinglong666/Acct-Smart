import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class WechatService {
  private readonly appId: string;
  private readonly appSecret: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.appId = this.configService.get<string>('WECHAT_APPID');
    this.appSecret = this.configService.get<string>('WECHAT_SECRET');
  }

  /**
   * 通过微信授权码获取用户openid和session_key
   */
  async getWechatUserInfo(code: string) {
    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const params = {
      appid: this.appId,
      secret: this.appSecret,
      js_code: code,
      grant_type: 'authorization_code',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { params })
      );

      const { openid, session_key, errcode, errmsg } = response.data;

      if (errcode) {
        throw BusinessException.operationError(`微信登录失败: ${errmsg}`);
      }

      return {
        openid,
        sessionKey: session_key,
      };
    } catch (error) {
      throw BusinessException.operationError('微信登录服务异常', { error: error.message });
    }
  }

  /**
   * 解密微信用户信息
   */
  async decryptUserInfo(encryptedData: string, iv: string, sessionKey: string) {
    // 这里需要实现微信用户信息解密逻辑
    // 可以使用crypto库进行AES解密
    // 为了简化，这里返回模拟数据
    return {
      nickName: '微信用户',
      avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      gender: 1,
      country: '中国',
      province: '广东',
      city: '深圳',
    };
  }

  /**
   * 获取微信用户openid (为了兼容auth.service.ts中的调用)
   */
  async getOpenidByCode(code: string) {
    return this.getWechatUserInfo(code);
  }

  /**
   * 微信登录
   */
  async login(code: string, encryptedData?: string, iv?: string) {
    // 获取微信用户openid和session_key
    const wechatData = await this.getWechatUserInfo(code);
    
    let userInfo = null;
    if (encryptedData && iv) {
      userInfo = await this.decryptUserInfo(encryptedData, iv, wechatData.sessionKey);
    }
    
    return {
      openid: wechatData.openid,
      sessionKey: wechatData.sessionKey,
      userInfo
    };
  }
}
