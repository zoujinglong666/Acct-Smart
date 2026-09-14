import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('mindmap')
@UseGuards(JwtAuthGuard)
export class MindmapController {
  constructor(private readonly mindmapService: MindmapService) {}

  @Get(':knowledgePointId')
  async generateMindmap(@Param('knowledgePointId') knowledgePointId: string) {
    return this.mindmapService.generateMindmap(+knowledgePointId);
  }

  @Post('save')
  async saveMindmap(
    @GetUser() user: User,
    @Body() mindmapData: {
      knowledgePointId: number;
      mindmapData: any;
    }
  ) {
    return this.mindmapService.saveMindmap(user.id, mindmapData.knowledgePointId, mindmapData.mindmapData);
  }

  @Get('user/:userId')
  async getUserMindmaps(@Param('userId') userId: string) {
    return this.mindmapService.getUserMindmaps(+userId);
  }
}