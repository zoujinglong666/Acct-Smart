import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前用户信息
   */
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  /**
   * 更新用户信息
   */
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  /**
   * 获取用户学习统计
   */
  @Get('stats')
  async getStats(@Request() req) {
    return this.userService.getStudyStats(req.user.id);
  }

  /**
   * 更新学习统计
   */
  @Post('study-time')
  async updateStudyTime(@Request() req, @Body() body: { studyTime: number }) {
    await this.userService.updateStudyStats(req.user.id, body.studyTime);
    return { success: true };
  }
}