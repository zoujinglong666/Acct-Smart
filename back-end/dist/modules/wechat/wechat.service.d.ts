import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class WechatService {
    private configService;
    private httpService;
    private readonly appId;
    private readonly appSecret;
    constructor(configService: ConfigService, httpService: HttpService);
    getWechatUserInfo(code: string): Promise<{
        openid: any;
        sessionKey: any;
    }>;
    decryptUserInfo(encryptedData: string, iv: string, sessionKey: string): Promise<{
        nickName: string;
        avatarUrl: string;
        gender: number;
        country: string;
        province: string;
        city: string;
    }>;
    getOpenidByCode(code: string): Promise<{
        openid: any;
        sessionKey: any;
    }>;
    login(code: string, encryptedData?: string, iv?: string): Promise<{
        openid: any;
        sessionKey: any;
        userInfo: any;
    }>;
}
