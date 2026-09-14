import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: number): Promise<User>;
    findByOpenid(openid: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    getStudyStats(userId: number): Promise<{
        totalStudyTime: number;
        continuousStudyDays: number;
        totalQuestions: number;
        correctQuestions: number;
        correctRate: number;
        lastStudyDate: Date;
    }>;
    updateStudyStats(userId: number, studyTime: number, questionCount?: number, correctCount?: number): Promise<User>;
    remove(id: number): Promise<void>;
}
