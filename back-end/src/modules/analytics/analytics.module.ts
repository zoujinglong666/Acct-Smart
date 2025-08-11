import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { StudyRecord } from '../study/entities/study-record.entity';
import { WrongQuestion } from '../study/entities/wrong-question.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyRecord,
      WrongQuestion,
      Question,
      User
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}