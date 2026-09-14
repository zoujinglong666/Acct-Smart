import { AuthService } from './auth.service';
export declare class WechatLoginDto {
    code: string;
    encryptedData?: string;
    iv?: string;
    userInfo?: any;
}
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RegisterDto {
    username: string;
    password: string;
    nickname?: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    test(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
        version: string;
    }>;
    wechatLogin(loginDto: WechatLoginDto): Promise<import("../../common/dto/base-response.dto").BaseResponse<{
        token: string;
        userInfo: {
            id: number;
            openid: string;
            nickname: string;
            avatar: string;
        };
    }>>;
    login(loginDto: LoginDto): Promise<import("../../common/dto/base-response.dto").BaseResponse<{
        token: string;
        userInfo: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
        };
    }>>;
    register(registerDto: RegisterDto): Promise<import("../../common/dto/base-response.dto").BaseResponse<{
        token: string;
        userInfo: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
        };
    }>>;
}
