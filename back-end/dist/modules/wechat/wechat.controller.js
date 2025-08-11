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
exports.WechatController = exports.WechatLoginDto = void 0;
const common_1 = require("@nestjs/common");
const wechat_service_1 = require("./wechat.service");
class WechatLoginDto {
}
exports.WechatLoginDto = WechatLoginDto;
let WechatController = class WechatController {
    constructor(wechatService) {
        this.wechatService = wechatService;
    }
    async login(dto) {
        return this.wechatService.login(dto.code, dto.encryptedData, dto.iv);
    }
    async getUserInfo(dto) {
        return this.wechatService.decryptUserInfo(dto.encryptedData, dto.iv, dto.sessionKey);
    }
};
exports.WechatController = WechatController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WechatLoginDto]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('userinfo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "getUserInfo", null);
exports.WechatController = WechatController = __decorate([
    (0, common_1.Controller)('wechat'),
    __metadata("design:paramtypes", [wechat_service_1.WechatService])
], WechatController);
//# sourceMappingURL=wechat.controller.js.map