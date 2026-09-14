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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.RegisterDto = exports.LoginDto = exports.WechatLoginDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_service_1 = require("./auth.service");
class WechatLoginDto {
}
exports.WechatLoginDto = WechatLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '微信授权码',
        example: 'wx_auth_code_example'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WechatLoginDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '加密数据（可选）',
        required: false,
        example: 'encrypted_data_example'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WechatLoginDto.prototype, "encryptedData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '初始向量（可选）',
        required: false,
        example: 'iv_example'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WechatLoginDto.prototype, "iv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户信息（可选）',
        required: false,
        example: { nickname: '用户昵称', avatar: 'https://avatar.url' }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WechatLoginDto.prototype, "userInfo", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户名',
        example: 'testuser'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '密码',
        example: '123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户名',
        example: 'newuser'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '密码',
        example: '123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '昵称（可选）',
        required: false,
        example: '新用户'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "nickname", void 0);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async test() {
        return {
            success: true,
            message: '后端连接正常',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    async wechatLogin(loginDto) {
        const { code, encryptedData, iv, userInfo } = loginDto;
        const result = await this.authService.wechatLogin(code, encryptedData, iv, userInfo);
        return result;
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const result = await this.authService.login(username, password);
        return result;
    }
    async register(registerDto) {
        const { username, password, nickname } = registerDto;
        const result = await this.authService.register(username, password, nickname);
        return result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({
        summary: '测试接口',
        description: '用于检查后端服务连接状态'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '连接正常',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '后端连接正常' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                version: { type: 'string', example: '1.0.0' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('wechat-login'),
    (0, swagger_1.ApiOperation)({
        summary: '微信小程序登录',
        description: '通过微信授权码进行用户登录，返回JWT token和用户信息'
    }),
    (0, swagger_1.ApiBody)({
        description: '微信登录请求数据',
        type: WechatLoginDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '登录成功',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'JWT访问令牌' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'number', example: 1 },
                                openid: { type: 'string', example: 'wx_openid_example' },
                                nickname: { type: 'string', example: '用户昵称' },
                                avatar: { type: 'string', example: 'https://avatar.url' }
                            }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '登录失败',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '登录失败' },
                error: { type: 'string', example: '错误详情' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WechatLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "wechatLogin", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: '普通登录',
        description: '通过用户名密码进行登录，返回JWT token和用户信息'
    }),
    (0, swagger_1.ApiBody)({
        description: '登录请求数据',
        type: LoginDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '登录成功',
        schema: {
            type: 'object',
            properties: {
                code: { type: 'number', example: 0 },
                message: { type: 'string', example: '登录成功' },
                data: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'JWT访问令牌' },
                        userInfo: {
                            type: 'object',
                            properties: {
                                id: { type: 'number', example: 1 },
                                username: { type: 'string', example: 'testuser' },
                                nickname: { type: 'string', example: '测试用户' },
                                avatar: { type: 'string', example: 'https://avatar.url' }
                            }
                        }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: '用户注册',
        description: '通过用户名密码进行注册，返回JWT token和用户信息'
    }),
    (0, swagger_1.ApiBody)({
        description: '注册请求数据',
        type: RegisterDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '注册成功',
        schema: {
            type: 'object',
            properties: {
                code: { type: 'number', example: 0 },
                message: { type: 'string', example: '注册成功' },
                data: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'JWT访问令牌' },
                        userInfo: {
                            type: 'object',
                            properties: {
                                id: { type: 'number', example: 1 },
                                username: { type: 'string', example: 'newuser' },
                                nickname: { type: 'string', example: '新用户' },
                                avatar: { type: 'string', example: 'https://avatar.url' }
                            }
                        }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('认证'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map