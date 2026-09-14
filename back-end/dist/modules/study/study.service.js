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
exports.StudyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const study_record_entity_1 = require("./entities/study-record.entity");
const wrong_question_entity_1 = require("./entities/wrong-question.entity");
const base_response_dto_1 = require("../../common/dto/base-response.dto");
const business_exception_1 = require("../../common/exceptions/business.exception");
let StudyService = class StudyService {
    constructor(studyRecordRepository, wrongQuestionRepository) {
        this.studyRecordRepository = studyRecordRepository;
        this.wrongQuestionRepository = wrongQuestionRepository;
    }
    async getStudyRecords(userId, limit = 30) {
        try {
            const records = await this.studyRecordRepository.find({
                where: { userId },
                relations: ['question'],
                order: { createdAt: 'DESC' },
                take: limit
            });
            return base_response_dto_1.BaseResponse.success(records, '获取学习记录成功');
        }
        catch (error) {
            console.error('获取学习记录失败:', error);
            throw business_exception_1.BusinessException.systemError('获取学习记录失败');
        }
    }
    async getWrongQuestions(userId) {
        try {
            const wrongQuestions = await this.wrongQuestionRepository.find({
                where: { userId },
                relations: ['question'],
                order: { createdAt: 'DESC' }
            });
            return base_response_dto_1.BaseResponse.success(wrongQuestions, '获取错题本成功');
        }
        catch (error) {
            console.error('获取错题本失败:', error);
            throw business_exception_1.BusinessException.systemError('获取错题本失败');
        }
    }
    async addWrongQuestion(userId, wrongQuestionData) {
        try {
            const questionId = parseInt(wrongQuestionData.questionId);
            const existingWrong = await this.wrongQuestionRepository.findOne({
                where: {
                    userId,
                    questionId
                }
            });
            if (existingWrong) {
                existingWrong.wrongCount += 1;
                existingWrong.userAnswer = wrongQuestionData.userAnswer;
                existingWrong.lastWrongTime = new Date();
                if (existingWrong.isSolved || existingWrong.isMastered) {
                    existingWrong.isSolved = false;
                    existingWrong.isMastered = false;
                }
                const updated = await this.wrongQuestionRepository.save(existingWrong);
                return base_response_dto_1.BaseResponse.success(updated, '错题记录已更新');
            }
            const wrongQuestion = this.wrongQuestionRepository.create({
                userId,
                questionId,
                userAnswer: wrongQuestionData.userAnswer,
                correctAnswer: wrongQuestionData.correctAnswer,
                explanation: wrongQuestionData.explanation,
                wrongCount: 1,
                isSolved: false
            });
            const saved = await this.wrongQuestionRepository.save(wrongQuestion);
            return base_response_dto_1.BaseResponse.success(saved, '错题添加成功');
        }
        catch (error) {
            console.error('添加错题失败:', error);
            throw business_exception_1.BusinessException.systemError('添加错题失败');
        }
    }
    async markWrongQuestionMastered(userId, wrongQuestionId) {
        try {
            const wrongQuestion = await this.wrongQuestionRepository.findOne({
                where: { id: wrongQuestionId, userId }
            });
            if (!wrongQuestion) {
                throw business_exception_1.BusinessException.notFoundError('错题记录不存在');
            }
            wrongQuestion.isSolved = true;
            wrongQuestion.isMastered = true;
            wrongQuestion.solvedTime = new Date();
            const updated = await this.wrongQuestionRepository.save(wrongQuestion);
            return base_response_dto_1.BaseResponse.success(updated, '标记成功');
        }
        catch (error) {
            console.error('标记错题失败:', error);
            if (error instanceof business_exception_1.BusinessException) {
                throw error;
            }
            throw business_exception_1.BusinessException.systemError('标记错题失败');
        }
    }
    async deleteWrongQuestion(userId, wrongQuestionId) {
        try {
            const result = await this.wrongQuestionRepository.delete({
                id: wrongQuestionId,
                userId
            });
            if (result.affected === 0) {
                throw business_exception_1.BusinessException.notFoundError('错题记录不存在');
            }
            return base_response_dto_1.BaseResponse.success(null, '删除成功');
        }
        catch (error) {
            console.error('删除错题失败:', error);
            if (error instanceof business_exception_1.BusinessException) {
                throw error;
            }
            throw business_exception_1.BusinessException.systemError('删除错题失败');
        }
    }
    async getTodayStatus(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const todayRecords = await this.studyRecordRepository.find({
                where: {
                    userId,
                    createdAt: (0, typeorm_2.Between)(today, tomorrow)
                }
            });
            const total = todayRecords.length;
            const correct = todayRecords.filter(r => r.isCorrect).length;
            const totalTime = todayRecords.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
            const status = {
                hasStudiedToday: total > 0,
                todayQuestions: total,
                todayCorrect: correct,
                todayAccuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
                todayStudyTime: Math.round(totalTime / 60)
            };
            return base_response_dto_1.BaseResponse.success(status, '获取今日状态成功');
        }
        catch (error) {
            console.error('获取今日状态失败:', error);
            throw business_exception_1.BusinessException.systemError('获取今日状态失败');
        }
    }
};
exports.StudyService = StudyService;
exports.StudyService = StudyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(study_record_entity_1.StudyRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(wrong_question_entity_1.WrongQuestion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StudyService);
//# sourceMappingURL=study.service.js.map