import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { QuestionModule } from './modules/question/question.module';
import { StudyModule } from './modules/study/study.module';
import { AiModule } from './modules/ai/ai.module';
import { WechatModule } from './modules/wechat/wechat.module';
import { OcrModule } from './modules/ocr/ocr.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ExamModule } from './modules/exam/exam.module';
import { MindmapModule } from './modules/mindmap/mindmap.module';
import { AudioModule } from './modules/audio/audio.module';

@Module({
  controllers: [AppController],
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 数据库连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
      inject: [ConfigService],
    }),

    // Redis和队列
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    // JWT全局配置
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
      global: true,
    }),

    // 业务模块
    AuthModule,
    UserModule,
    KnowledgeModule,
    QuestionModule,
    StudyModule,
    AiModule,
    WechatModule,
    OcrModule,
    AnalyticsModule,
    ExamModule,
    MindmapModule,
    AudioModule,
  ],
})
export class AppModule {}