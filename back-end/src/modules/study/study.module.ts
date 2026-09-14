import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecord } from './entities/study-record.entity';
import { WrongQuestion } from './entities/wrong-question.entity';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyRecord,
      WrongQuestion
    ])
  ],
  controllers: [StudyController],
  providers: [StudyService],
  exports: [StudyService, TypeOrmModule]
})
export class StudyModule {}
