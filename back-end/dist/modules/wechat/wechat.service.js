"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const business_exception_1 = require("../../common/exceptions/business.exception");
let WechatService = class WechatService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.appId = this.configService.get('WECHAT_APPID');
        this.appSecret = this.configService.get('WECHAT_SECRET');
    }
    async getWechatUserInfo(code) {
        const url = 'https://api.weixin.qq.com/sns/jscode2session';
        const params = {
            appid: this.appId,
            secret: this.appSecret,
            js_code: code,
            grant_type: 'authorization_code',
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params }));
            const { openid, session_key, errcode, errmsg } = response.data;
            if (errcode) {
                throw business_exception_1.BusinessException.operationError(`微信登录失败: ${errmsg}`);
            }
            return {
                openid,
                sessionKey: session_key,
            };
        }
        catch (error) {
            throw business_exception_1.BusinessException.operationError('微信登录服务异常', { error: error.message });
        }
    }
    async decryptUserInfo(encryptedData, iv, sessionKey) {
        return {
            nickName: '微信用户',
            avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
            gender: 1,
            country: '中国',
            province: '广东',
            city: '深圳',
        };
    }
    async getOpenidByCode(code) {
        return this.getWechatUserInfo(code);
    }
    async login(code, encryptedData, iv) {
        const wechatData = await this.getWechatUserInfo(code);
        let userInfo = null;
        if (encryptedData && iv) {
            userInfo = await this.decryptUserInfo(encryptedData, iv, wechatData.sessionKey);
        }
        return {
            openid: wechatData.openid,
            sessionKey: wechatData.sessionKey,
            userInfo
        };
    }
};
exports.WechatService = WechatService;
exports.WechatService = WechatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], WechatService);
//# sourceMappingURL=wechat.service.js.map