import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BusinessExceptionFilter, HttpExceptionFilter, AllExceptionsFilter } from './common/filters/business-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 全局异常过滤器 - 按顺序注册，越具体的越先处理
  app.useGlobalFilters(
    new AllExceptionsFilter(),      // 捕获所有未处理的异常
    new HttpExceptionFilter(),      // 捕获HTTP异常
    new BusinessExceptionFilter(),  // 捕获业务异常
  );

  // 全局响应拦截器 - 统一状态码为200
  app.useGlobalInterceptors(new TransformInterceptor());

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('AI中级会计助手 API')
    .setDescription('智能学习系统后端API文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT) || 8123;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  // 计算本机局域网 IPv4 地址
  const nets = os.networkInterfaces();
  let localIp = '127.0.0.1';
  for (const name of Object.keys(nets)) {
    const addrs = nets[name] || [];
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        localIp = addr.address;
        break;
      }
    }
    if (localIp !== '127.0.0.1') break;
  }

  console.log('🚀 服务已启动:');
  console.log(`  - 本机:    http://localhost:${port}`);
  console.log(`  - 局域网:  http://${localIp}:${port}`);
  console.log('📚 API 文档:');
  console.log(`  - 本机:    http://localhost:${port}/api/docs`);
  console.log(`  - 局域网:  http://${localIp}:${port}/api/docs`);
}

bootstrap();