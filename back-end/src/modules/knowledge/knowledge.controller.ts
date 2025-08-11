import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('knowledge')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  async findAll() {
    return this.knowledgeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.knowledgeService.findOne(+id);
  }

  @Get(':id/questions')
  async getQuestionsByKnowledgePoint(@Param('id') id: string) {
    return this.knowledgeService.getQuestionsByKnowledgePoint(+id);
  }

  @Get('tree/structure')
  async getKnowledgeTree() {
    return this.knowledgeService.getKnowledgeTree();
  }
}