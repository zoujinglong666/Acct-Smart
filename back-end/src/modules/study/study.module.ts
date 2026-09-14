import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecord } from './entities/study-record.entity';
import { WrongQuestion } from './entities/wrong-question.entity';
import { StudyPlan } from './entities/study-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyRecord,
      WrongQuestion,
      StudyPlan
    ])
  ],
  exports: [TypeOrmModule]
})
export class StudyModule {}