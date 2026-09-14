import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { WechatService } from '../wechat/wechat.service';
import { BaseResponse } from '@/common/dto/base-response.dto';
export declare class AuthService {
    private userService;
    private wechatService;
    private jwtService;
    constructor(userService: UserService, wechatService: WechatService, jwtService: JwtService);
    wechatLogin(code: string, encryptedData?: string, iv?: string, userInfo?: any): Promise<BaseResponse<{
        token: string;
        userInfo: {
            id: number;
            openid: string;
            nickname: string;
            avatar: string;
        };
    }>>;
    private mockWechatLogin;
    login(username: string, password: string): Promise<BaseResponse<{
        token: string;
        userInfo: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
        };
    }>>;
    register(username: string, password: string, nickname?: string): Promise<BaseResponse<{
        token: string;
        userInfo: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
        };
    }>>;
    validateToken(token: string): Promise<import("../user/entities/user.entity").User>;
}
