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
const study_plan_entity_1 = require("./entities/study-plan.entity");
const base_response_dto_1 = require("../../common/dto/base-response.dto");
const business_exception_1 = require("../../common/exceptions/business.exception");
let StudyService = class StudyService {
    constructor(studyRecordRepository, wrongQuestionRepository, studyPlanRepository) {
        this.studyRecordRepository = studyRecordRepository;
        this.wrongQuestionRepository = wrongQuestionRepository;
        this.studyPlanRepository = studyPlanRepository;
    }
    async getStudyRecords(userId) {
        try {
            const records = await this.studyRecordRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
                take: 30
            });
            return base_response_dto_1.BaseResponse.success(records, '获取学习记录成功');
        }
        catch (error) {
            console.error('获取学习记录失败:', error);
            throw business_exception_1.BusinessException.systemError('获取学习记录失败');
        }
    }
    async createStudyRecord(userId, recordData) {
        try {
            const record = this.studyRecordRepository.create({
                userId,
                studyTime: recordData.studyTime,
                completedQuestions: recordData.completedQuestions,
                accuracy: recordData.accuracy,
                studyDate: new Date(),
                type: recordData.type || 'practice'
            });
            const savedRecord = await this.studyRecordRepository.save(record);
            return base_response_dto_1.BaseResponse.success(savedRecord, '学习记录创建成功');
        }
        catch (error) {
            console.error('创建学习记录失败:', error);
            throw business_exception_1.BusinessException.systemError('创建学习记录失败');
        }
    }
    async getWrongQuestions(userId) {
        try {
            const wrongQuestions = await this.wrongQuestionRepository.find({
                where: { userId },
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
            const existingWrong = await this.wrongQuestionRepository.findOne({
                where: {
                    userId,
                    questionId: wrongQuestionData.questionId
                }
            });
            if (existingWrong) {
                existingWrong.wrongCount += 1;
                existingWrong.lastWrongTime = new Date();
                const updated = await this.wrongQuestionRepository.save(existingWrong);
                return base_response_dto_1.BaseResponse.success(updated, '错题记录已更新');
            }
            else {
                const wrongQuestion = this.wrongQuestionRepository.create({
                    userId,
                    questionId: wrongQuestionData.questionId,
                    userAnswer: wrongQuestionData.userAnswer,
                    correctAnswer: wrongQuestionData.correctAnswer,
                    explanation: wrongQuestionData.explanation,
                    wrongCount: 1,
                    isSolved: false
                });
                const saved = await this.wrongQuestionRepository.save(wrongQuestion);
                return base_response_dto_1.BaseResponse.success(saved, '错题添加成功');
            }
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
    async getStudyPlans(userId) {
        try {
            const plans = await this.studyPlanRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' }
            });
            return base_response_dto_1.BaseResponse.success(plans, '获取学习计划成功');
        }
        catch (error) {
            console.error('获取学习计划失败:', error);
            throw business_exception_1.BusinessException.systemError('获取学习计划失败');
        }
    }
    async createStudyPlan(userId, planData) {
        try {
            const plan = this.studyPlanRepository.create({
                userId,
                name: planData.name,
                title: planData.title || planData.name,
                description: planData.description,
                startDate: planData.startDate || new Date(),
                endDate: planData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                dailyTime: planData.dailyTime || 60,
                subjects: planData.subjects || [],
                content: planData.content || {
                    knowledgePoints: [],
                    dailyQuestionCount: 10,
                    difficulty: 'medium'
                },
                totalDays: planData.totalDays || 30,
                status: 'active'
            });
            const saved = await this.studyPlanRepository.save(plan);
            return base_response_dto_1.BaseResponse.success(saved, '学习计划创建成功');
        }
        catch (error) {
            console.error('创建学习计划失败:', error);
            throw business_exception_1.BusinessException.systemError('创建学习计划失败');
        }
    }
    async updateStudyPlan(userId, planId, planData) {
        try {
            const plan = await this.studyPlanRepository.findOne({
                where: { id: planId, userId }
            });
            if (!plan) {
                throw business_exception_1.BusinessException.notFoundError('学习计划不存在');
            }
            Object.assign(plan, planData);
            const updated = await this.studyPlanRepository.save(plan);
            return base_response_dto_1.BaseResponse.success(updated, '学习计划更新成功');
        }
        catch (error) {
            console.error('更新学习计划失败:', error);
            if (error instanceof business_exception_1.BusinessException) {
                throw error;
            }
            throw business_exception_1.BusinessException.systemError('更新学习计划失败');
        }
    }
    async completeStudyPlan(userId, planId) {
        try {
            const plan = await this.studyPlanRepository.findOne({
                where: { id: planId, userId }
            });
            if (!plan) {
                throw business_exception_1.BusinessException.notFoundError('学习计划不存在');
            }
            plan.status = 'completed';
            plan.completedAt = new Date();
            const updated = await this.studyPlanRepository.save(plan);
            return base_response_dto_1.BaseResponse.success(updated, '学习计划完成');
        }
        catch (error) {
            console.error('完成学习计划失败:', error);
            if (error instanceof business_exception_1.BusinessException) {
                throw error;
            }
            throw business_exception_1.BusinessException.systemError('完成学习计划失败');
        }
    }
    async getTodayStatus(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const todayRecord = await this.studyRecordRepository.findOne({
                where: {
                    userId,
                    studyDate: {
                        $gte: today,
                        $lt: tomorrow
                    }
                }
            });
            const status = {
                hasStudiedToday: !!todayRecord,
                todayStudyTime: todayRecord?.studyTime || 0,
                todayQuestions: todayRecord?.completedQuestions || 0,
                todayAccuracy: todayRecord?.accuracy || 0
            };
            return base_response_dto_1.BaseResponse.success(status, '获取今日状态成功');
        }
        catch (error) {
            console.error('获取今日状态失败:', error);
            throw business_exception_1.BusinessException.systemError('获取今日状态失败');
        }
    }
    async saveDailyRecord(userId, recordData) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            let todayRecord = await this.studyRecordRepository.findOne({
                where: {
                    userId,
                    studyDate: (0, typeorm_2.Between)(today, tomorrow)
                }
            });
            if (todayRecord) {
                todayRecord.studyTime += recordData.studyTime;
                todayRecord.completedQuestions += recordData.completedQuestions;
                todayRecord.accuracy = Math.round((todayRecord.accuracy + recordData.accuracy) / 2);
                const updated = await this.studyRecordRepository.save(todayRecord);
                return base_response_dto_1.BaseResponse.success(updated, '今日记录更新成功');
            }
            else {
                const newRecord = this.studyRecordRepository.create({
                    userId,
                    studyTime: recordData.studyTime,
                    completedQuestions: recordData.completedQuestions,
                    accuracy: recordData.accuracy,
                    studyDate: new Date()
                });
                const saved = await this.studyRecordRepository.save(newRecord);
                return base_response_dto_1.BaseResponse.success(saved, '今日记录创建成功');
            }
        }
        catch (error) {
            console.error('保存每日记录失败:', error);
            throw business_exception_1.BusinessException.systemError('保存每日记录失败');
        }
    }
};
exports.StudyService = StudyService;
exports.StudyService = StudyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(study_record_entity_1.StudyRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(wrong_question_entity_1.WrongQuestion)),
    __param(2, (0, typeorm_1.InjectRepository)(study_plan_entity_1.StudyPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudyService);
//# sourceMappingURL=study.service.js.map