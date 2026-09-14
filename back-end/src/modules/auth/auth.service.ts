import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { WechatService } from '../wechat/wechat.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { BaseResponse } from '@/common/dto/base-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private wechatService: WechatService,
    private jwtService: JwtService,
  ) {}

  /**
   * 微信登录
   */
  async wechatLogin(code: string, encryptedData?: string, iv?: string, userInfo?: any) {
    try {
      // 如果没有微信服务配置或code为mock，使用模拟登录
      if (!code || code === 'mock') {
        return this.mockWechatLogin(userInfo);
      }

      // 1. 尝试通过code获取openid和session_key
      let wechatData;
      try {
        wechatData = await this.wechatService.getOpenidByCode(code);
      } catch (wechatError) {
        // 如果微信服务失败（如配置无效），回退到模拟登录
        console.log('微信服务失败，使用模拟登录:', wechatError.message);
        return this.mockWechatLogin(userInfo);
      }
      
      if (!wechatData.openid) {
        // 如果没有获取到openid，使用模拟登录
        console.log('未获取到openid，使用模拟登录');
        return this.mockWechatLogin(userInfo);
      }

      // 2. 查找或创建用户
      let user = await this.userService.findByOpenid(wechatData.openid);
      
      if (!user) {
        // 创建新用户
        user = await this.userService.create({
          openid: wechatData.openid,
          unionid: null,
          nickname: userInfo?.nickName || '微信用户',
          avatar: userInfo?.avatarUrl || '',
        });
      }

      // 3. 如果有加密数据，解密用户信息
      if (encryptedData && iv && wechatData.sessionKey) {
        try {
          const decryptedUserInfo = await this.wechatService.decryptUserInfo(
            encryptedData,
            iv,
            wechatData.sessionKey
          );
          
          // 更新用户信息
          await this.userService.update(user.id, {
            nickname: decryptedUserInfo.nickName,
            avatar: decryptedUserInfo.avatarUrl,
            gender: decryptedUserInfo.gender === 1 ? 'male' : decryptedUserInfo.gender === 2 ? 'female' : 'unknown',
          });
        } catch (error) {
          console.error('解密用户信息失败:', error);
        }
      } else if (userInfo) {
        // 使用前端传递的用户信息
        await this.userService.update(user.id, {
          nickname: userInfo.nickName || user.nickname,
          avatar: userInfo.avatarUrl || user.avatar,
          gender: userInfo.gender === 1 ? 'male' : userInfo.gender === 2 ? 'female' : 'unknown',
        });
      }

      // 4. 生成JWT token
      const payload = { sub: user.id, openid: user.openid };
      const token = this.jwtService.sign(payload);

      return BaseResponse.success({
        token,
        userInfo: {
          id: user.id,
          openid: user.openid,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      }, '登录成功');
    } catch (error) {
      console.error('微信登录失败:', error);
      // 如果是微信服务异常，提供更详细的错误信息
      if (error.message && error.message.includes('微信')) {
        throw BusinessException.operationError('微信登录服务异常，请稍后重试');
      }
      throw BusinessException.operationError('登录失败，请稍后重试');
    }
  }

  /**
   * 模拟微信登录（用于开发测试）
   */
  private async mockWechatLogin(userInfo?: any) {
    try {
      const mockOpenid = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;



      // 创建模拟用户
      const user = await this.userService.create({
        openid: mockOpenid,
        nickname: userInfo?.nickName || '测试用户',
        avatar: userInfo?.avatarUrl || 'https://via.placeholder.com/100',
      });
      console.log('模拟用户创建成功:', user);

      // 生成JWT token
      const payload = { sub: user.id, openid: user.openid };
      const token = this.jwtService.sign(payload);

      return BaseResponse.success({
        token,
        userInfo: {
          id: user.id,
          openid: user.openid,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      }, '模拟登录成功');
    } catch (error) {
      console.error('模拟登录失败:', error);
      throw BusinessException.operationError('模拟登录失败');
    }
  }

  /**
   * 普通登录
   */
  async login(username: string, password: string) {
    try {
      // 从数据库查找用户
      const user = await this.userService.findByUsername(username);
      
      if (!user) {
        throw BusinessException.operationError('用户名或密码错误');
      }

      // 验证密码（实际项目中应该使用加密密码比较）
      if (user.password !== password) {
        throw BusinessException.operationError('用户名或密码错误');
      }

      // 生成JWT token
      const payload = { sub: user.id, username: user.username };
      const token = this.jwtService.sign(payload);

      return BaseResponse.success({
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      }, '登录成功');
    } catch (error) {
      console.error('普通登录失败:', error);
      if (error instanceof BusinessException) {
        throw error;
      }
      throw BusinessException.operationError('登录失败，请稍后重试');
    }
  }

  /**
   * 用户注册
   */
  async register(username: string, password: string, nickname?: string) {
    try {
      // 检查用户名是否已存在
      const existingUser = await this.userService.findByUsername(username);
      if (existingUser) {
        throw BusinessException.operationError('用户名已存在');
      }

      // 创建新用户
      const user = await this.userService.create({
        username,
        password, // 实际项目中应该加密密码
        nickname: nickname || username,
        openid: null, // 普通注册用户没有openid
      });

      // 生成JWT token
      const payload = { sub: user.id, username: user.username };
      const token = this.jwtService.sign(payload);

      return BaseResponse.success({
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      }, '注册成功');
    } catch (error) {
      console.error('用户注册失败:', error);
      if (error instanceof BusinessException) {
        throw error;
      }
      throw BusinessException.operationError('注册失败，请稍后重试');
    }
  }

  /**
   * 验证JWT token
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOne(payload.sub);
      return user;
    } catch (error) {
      throw BusinessException.notLoginError('Token验证失败');
    }
  }
}
