import { IsString, IsOptional, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  openid?: string;

  @IsOptional()
  @IsString()
  unionid?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'unknown'])
  gender?: 'male' | 'female' | 'unknown';

  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  preferences?: {
    dailyGoal: number;
    reminderTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}