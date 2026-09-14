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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const business_exception_1 = require("../../common/exceptions/business.exception");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw business_exception_1.BusinessException.notFoundError('用户不存在');
        }
        return user;
    }
    async findByOpenid(openid) {
        return this.userRepository.findOne({ where: { openid } });
    }
    async findByUsername(username) {
        return this.userRepository.findOne({ where: { username } });
    }
    async update(id, updateUserDto) {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }
    async getStudyStats(userId) {
        const user = await this.findOne(userId);
        const correctRate = user.totalQuestions > 0
            ? Math.round((user.correctQuestions / user.totalQuestions) * 100)
            : 0;
        return {
            totalStudyTime: user.totalStudyTime,
            continuousStudyDays: user.continuousStudyDays,
            totalQuestions: user.totalQuestions,
            correctQuestions: user.correctQuestions,
            correctRate,
            lastStudyDate: user.lastStudyDate
        };
    }
    async updateStudyStats(userId, studyTime, questionCount, correctCount) {
        const user = await this.findOne(userId);
        const today = new Date().toISOString().split('T')[0];
        const lastStudyDate = user.lastStudyDate?.toISOString().split('T')[0];
        let continuousStudyDays = user.continuousStudyDays;
        if (lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            if (lastStudyDate === yesterdayStr) {
                continuousStudyDays += 1;
            }
            else if (lastStudyDate !== today) {
                continuousStudyDays = 1;
            }
        }
        const updateData = {
            totalStudyTime: user.totalStudyTime + studyTime,
            continuousStudyDays,
            lastStudyDate: new Date(),
        };
        if (questionCount !== undefined) {
            updateData.totalQuestions = user.totalQuestions + questionCount;
        }
        if (correctCount !== undefined) {
            updateData.correctQuestions = user.correctQuestions + correctCount;
        }
        await this.userRepository.update(userId, updateData);
        return this.findOne(userId);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map