"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const business_exception_filter_1 = require("./common/filters/business-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const swagger_1 = require("@nestjs/swagger");
const os = require("os");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new business_exception_filter_1.AllExceptionsFilter(), new business_exception_filter_1.HttpExceptionFilter(), new business_exception_filter_1.BusinessExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AI中级会计助手 API')
        .setDescription('智能学习系统后端API文档')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = Number(process.env.PORT) || 8123;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);
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
        if (localIp !== '127.0.0.1')
            break;
    }
    console.log('🚀 服务已启动:');
    console.log(`  - 本机:    http://localhost:${port}`);
    console.log(`  - 局域网:  http://${localIp}:${port}`);
    console.log('📚 API 文档:');
    console.log(`  - 本机:    http://localhost:${port}/api/docs`);
    console.log(`  - 局域网:  http://${localIp}:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map