import { WechatService } from './wechat.service';
export declare class WechatLoginDto {
    code: string;
    encryptedData?: string;
    iv?: string;
}
export declare class WechatController {
    private readonly wechatService;
    constructor(wechatService: WechatService);
    login(dto: WechatLoginDto): Promise<{
        openid: any;
        sessionKey: any;
        userInfo: any;
    }>;
    getUserInfo(dto: {
        encryptedData: string;
        iv: string;
        sessionKey: string;
    }): Promise<{
        nickName: string;
        avatarUrl: string;
        gender: number;
        country: string;
        province: string;
        city: string;
    }>;
}
