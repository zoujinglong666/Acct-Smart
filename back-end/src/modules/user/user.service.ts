import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * 根据ID查找用户
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw BusinessException.notFoundError('用户不存在');
    }
    return user;
  }

  /**
   * 根据openid查找用户
   */
  async findByOpenid(openid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { openid } });
  }

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * 更新用户信息
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  /**
   * 获取用户学习统计
   */
  async getStudyStats(userId: number) {
    const user = await this.findOne(userId);
    
    const correctRate = user.totalQuestions > 0 
      ? Math.round((user.correctQuestions / user.totalQuestions) * 100)
      : 0;

    return {
      totalStudyTime: user.totalStudyTime,
      continuousStudyDays: user.continuousStudyDays,
      totalQuestions: user.totalQuestions,
      correctQuestions: user.correctQuestions,
      correctRate,
      lastStudyDate: user.lastStudyDate
    };
  }

  /**
   * 更新学习统计
   */
  async updateStudyStats(userId: number, studyTime: number, questionCount?: number, correctCount?: number) {
    const user = await this.findOne(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastStudyDate = user.lastStudyDate?.toISOString().split('T')[0];

    // 更新连续学习天数
    let continuousStudyDays = user.continuousStudyDays;
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastStudyDate === yesterdayStr) {
        continuousStudyDays += 1;
      } else if (lastStudyDate !== today) {
        continuousStudyDays = 1;
      }
    }

    const updateData: Partial<User> = {
      totalStudyTime: user.totalStudyTime + studyTime,
      continuousStudyDays,
      lastStudyDate: new Date(),
    };

    if (questionCount !== undefined) {
      updateData.totalQuestions = user.totalQuestions + questionCount;
    }

    if (correctCount !== undefined) {
      updateData.correctQuestions = user.correctQuestions + correctCount;
    }

    await this.userRepository.update(userId, updateData);
    return this.findOne(userId);
  }

  /**
   * 删除用户
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}