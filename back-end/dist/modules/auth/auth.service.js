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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const wechat_service_1 = require("../wechat/wechat.service");
const business_exception_1 = require("../../common/exceptions/business.exception");
const base_response_dto_1 = require("../../common/dto/base-response.dto");
let AuthService = class AuthService {
    constructor(userService, wechatService, jwtService) {
        this.userService = userService;
        this.wechatService = wechatService;
        this.jwtService = jwtService;
    }
    async wechatLogin(code, encryptedData, iv, userInfo) {
        try {
            if (!code || code === 'mock') {
                return this.mockWechatLogin(userInfo);
            }
            let wechatData;
            try {
                wechatData = await this.wechatService.getOpenidByCode(code);
            }
            catch (wechatError) {
                console.log('微信服务失败，使用模拟登录:', wechatError.message);
                return this.mockWechatLogin(userInfo);
            }
            if (!wechatData.openid) {
                console.log('未获取到openid，使用模拟登录');
                return this.mockWechatLogin(userInfo);
            }
            let user = await this.userService.findByOpenid(wechatData.openid);
            if (!user) {
                user = await this.userService.create({
                    openid: wechatData.openid,
                    unionid: null,
                    nickname: userInfo?.nickName || '微信用户',
                    avatar: userInfo?.avatarUrl || '',
                });
            }
            if (encryptedData && iv && wechatData.sessionKey) {
                try {
                    const decryptedUserInfo = await this.wechatService.decryptUserInfo(encryptedData, iv, wechatData.sessionKey);
                    await this.userService.update(user.id, {
                        nickname: decryptedUserInfo.nickName,
                        avatar: decryptedUserInfo.avatarUrl,
                        gender: decryptedUserInfo.gender === 1 ? 'male' : decryptedUserInfo.gender === 2 ? 'female' : 'unknown',
                    });
                }
                catch (error) {
                    console.error('解密用户信息失败:', error);
                }
            }
            else if (userInfo) {
                await this.userService.update(user.id, {
                    nickname: userInfo.nickName || user.nickname,
                    avatar: userInfo.avatarUrl || user.avatar,
                    gender: userInfo.gender === 1 ? 'male' : userInfo.gender === 2 ? 'female' : 'unknown',
                });
            }
            const payload = { sub: user.id, openid: user.openid };
            const token = this.jwtService.sign(payload);
            return base_response_dto_1.BaseResponse.success({
                token,
                userInfo: {
                    id: user.id,
                    openid: user.openid,
                    nickname: user.nickname,
                    avatar: user.avatar,
                },
            }, '登录成功');
        }
        catch (error) {
            console.error('微信登录失败:', error);
            if (error.message && error.message.includes('微信')) {
                throw business_exception_1.BusinessException.operationError('微信登录服务异常，请稍后重试');
            }
            throw business_exception_1.BusinessException.operationError('登录失败，请稍后重试');
        }
    }
    async mockWechatLogin(userInfo) {
        try {
            const mockOpenid = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const user = await this.userService.create({
                openid: mockOpenid,
                nickname: userInfo?.nickName || '测试用户',
                avatar: userInfo?.avatarUrl || 'https://via.placeholder.com/100',
            });
            console.log('模拟用户创建成功:', user);
            const payload = { sub: user.id, openid: user.openid };
            const token = this.jwtService.sign(payload);
            return base_response_dto_1.BaseResponse.success({
                token,
                userInfo: {
                    id: user.id,
                    openid: user.openid,
                    nickname: user.nickname,
                    avatar: user.avatar,
                },
            }, '模拟登录成功');
        }
        catch (error) {
            console.error('模拟登录失败:', error);
            throw business_exception_1.BusinessException.operationError('模拟登录失败');
        }
    }
    async login(username, password) {
        try {
            const user = await this.userService.findByUsername(username);
            if (!user) {
                throw business_exception_1.BusinessException.operationError('用户名或密码错误');
            }
            if (user.password !== password) {
                throw business_exception_1.BusinessException.operationError('用户名或密码错误');
            }
            const payload = { sub: user.id, username: user.username };
            const token = this.jwtService.sign(payload);
            return base_response_dto_1.BaseResponse.success({
                token,
                userInfo: {
                    id: user.id,
                    username: user.username,
                    nickname: user.nickname,
                    avatar: user.avatar,
                },
            }, '登录成功');
        }
        catch (error) {
            console.error('普通登录失败:', error);
            if (error instanceof business_exception_1.BusinessException) {
                throw error;
            }
            throw business_exception_1.BusinessException.operationError('登录失败，请稍后重试');
        }
    }
    async register(username, password, nickname) {
        try {
            const existingUser = await this.userService.findByUsername(username);
            if (existingUser) {
                throw business_exception_1.BusinessException.operationError('用户名已存在');
            }
            const user = await this.userService.create({
                username,
                password,
                nickname: nickname || username,
                openid: null,
            });
            const payload = { sub: user.id, username: user.username };
            const token = this.jwtService.sign(payload);
            return base_response_dto_1.BaseResponse.success({
                token,
                userInfo: {
                    id: user.id,
                    username: user.username,
                    nickname: user.nickname,
                    avatar: user.avatar,
                },
            }, '注册成功');
        }
        catch (error) {
            console.error('用户注册失败:', error);
            if (error instanceof business_exception_1.BusinessException) {
                throw error;
            }
            throw business_exception_1.BusinessException.operationError('注册失败，请稍后重试');
        }
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findOne(payload.sub);
            return user;
        }
        catch (error) {
            throw business_exception_1.BusinessException.notLoginError('Token验证失败');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        wechat_service_1.WechatService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map