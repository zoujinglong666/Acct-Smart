import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './entities/question.entity';
import { StudyRecord } from '../study/entities/study-record.entity';
import { WrongQuestion } from '../study/entities/wrong-question.entity';
import { KnowledgePoint } from '../knowledge/entities/knowledge-point.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      StudyRecord,
      WrongQuestion,
      KnowledgePoint
    ])
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule {}