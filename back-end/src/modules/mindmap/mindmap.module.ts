import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MindmapService } from './mindmap.service';
import { MindmapController } from './mindmap.controller';
import { KnowledgePoint } from '../knowledge/entities/knowledge-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgePoint])],
  controllers: [MindmapController],
  providers: [MindmapService],
  exports: [MindmapService],
})
export class MindmapModule {}