import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExamPaper } from './entities/exam-paper.entity';
import { ExamRecord } from './entities/exam-record.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamPaper,
      ExamRecord,
      Question,
      User
    ])
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService]
})
export class ExamModule {}