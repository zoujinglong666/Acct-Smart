import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';

export class WechatLoginDto {
  @ApiProperty({
    description: '微信授权码',
    example: 'wx_auth_code_example'
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: '加密数据（可选）',
    required: false,
    example: 'encrypted_data_example'
  })
  @IsOptional()
  @IsString()
  encryptedData?: string;

  @ApiProperty({
    description: '初始向量（可选）',
    required: false,
    example: 'iv_example'
  })
  @IsOptional()
  @IsString()
  iv?: string;

  @ApiProperty({
    description: '用户信息（可选）',
    required: false,
    example: { nickname: '用户昵称', avatar: 'https://avatar.url' }
  })
  @IsOptional()
  userInfo?: any;
}

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'testuser'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: '用户名',
    example: 'newuser'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '昵称（可选）',
    required: false,
    example: '新用户'
  })
  @IsOptional()
  @IsString()
  nickname?: string;
}

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 测试接口 - 用于检查后端连接
   */
  @Get('test')
  @ApiOperation({ 
    summary: '测试接口', 
    description: '用于检查后端服务连接状态' 
  })
  @ApiResponse({
    status: 200,
    description: '连接正常',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '后端连接正常' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        version: { type: 'string', example: '1.0.0' }
      }
    }
  })
  async test() {
    return {
      success: true,
      message: '后端连接正常',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * 微信小程序登录
   */
  @Post('wechat-login')
  @ApiOperation({ 
    summary: '微信小程序登录', 
    description: '通过微信授权码进行用户登录，返回JWT token和用户信息' 
  })
  @ApiBody({
    description: '微信登录请求数据',
    type: WechatLoginDto
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT访问令牌' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                openid: { type: 'string', example: 'wx_openid_example' },
                nickname: { type: 'string', example: '用户昵称' },
                avatar: { type: 'string', example: 'https://avatar.url' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: '登录失败',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '登录失败' },
        error: { type: 'string', example: '错误详情' }
      }
    }
  })
  async wechatLogin(@Body() loginDto: WechatLoginDto) {
    const { code, encryptedData, iv, userInfo } = loginDto;
    // 调用认证服务，异常会被全局异常过滤器处理
    const result = await this.authService.wechatLogin(code, encryptedData, iv, userInfo);
    return result;
  }

  /**
   * 普通登录
   */
  @Post('login')
  @ApiOperation({ 
    summary: '普通登录', 
    description: '通过用户名密码进行登录，返回JWT token和用户信息' 
  })
  @ApiBody({
    description: '登录请求数据',
    type: LoginDto
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 0 },
        message: { type: 'string', example: '登录成功' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT访问令牌' },
            userInfo: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'testuser' },
                nickname: { type: 'string', example: '测试用户' },
                avatar: { type: 'string', example: 'https://avatar.url' }
              }
            }
          }
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const result = await this.authService.login(username, password);
    return result;
  }

  /**
   * 用户注册
   */
  @Post('register')
  @ApiOperation({ 
    summary: '用户注册', 
    description: '通过用户名密码进行注册，返回JWT token和用户信息' 
  })
  @ApiBody({
    description: '注册请求数据',
    type: RegisterDto
  })
  @ApiResponse({
    status: 200,
    description: '注册成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 0 },
        message: { type: 'string', example: '注册成功' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT访问令牌' },
            userInfo: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'newuser' },
                nickname: { type: 'string', example: '新用户' },
                avatar: { type: 'string', example: 'https://avatar.url' }
              }
            }
          }
        }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    const { username, password, nickname } = registerDto;
    const result = await this.authService.register(username, password, nickname);
    return result;
  }
}
