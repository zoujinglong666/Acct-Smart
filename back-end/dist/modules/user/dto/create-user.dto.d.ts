export declare class CreateUserDto {
    openid?: string;
    unionid?: string;
    username?: string;
    password?: string;
    nickname: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'unknown';
    phone?: string;
    email?: string;
    preferences?: {
        dailyGoal: number;
        reminderTime: string;
        difficulty: 'easy' | 'medium' | 'hard';
    };
}
