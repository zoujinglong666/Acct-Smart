"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const jwt_1 = require("@nestjs/jwt");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const knowledge_module_1 = require("./modules/knowledge/knowledge.module");
const question_module_1 = require("./modules/question/question.module");
const study_module_1 = require("./modules/study/study.module");
const ai_module_1 = require("./modules/ai/ai.module");
const wechat_module_1 = require("./modules/wechat/wechat.module");
const ocr_module_1 = require("./modules/ocr/ocr.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const exam_module_1 = require("./modules/exam/exam.module");
const mindmap_module_1 = require("./modules/mindmap/mindmap.module");
const audio_module_1 = require("./modules/audio/audio.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_DATABASE', 'acct_smart'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET', 'your-secret-key'),
                    signOptions: { expiresIn: '7d' },
                }),
                inject: [config_1.ConfigService],
                global: true,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            knowledge_module_1.KnowledgeModule,
            question_module_1.QuestionModule,
            study_module_1.StudyModule,
            ai_module_1.AiModule,
            wechat_module_1.WechatModule,
            ocr_module_1.OcrModule,
            analytics_module_1.AnalyticsModule,
            exam_module_1.ExamModule,
            mindmap_module_1.MindmapModule,
            audio_module_1.AudioModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map