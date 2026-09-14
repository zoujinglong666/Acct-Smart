import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('系统')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  getHealth() {
    return {
      code: 200,
      message: '服务运行正常',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }
    };
  }

  @Get()
  @ApiOperation({ summary: '根路径' })
  getRoot() {
    return {
      code: 200,
      message: 'AI中级会计助手后端服务',
      data: {
        version: '1.0.0',
        description: '智能学习系统后端API'
      }
    };
  }
}