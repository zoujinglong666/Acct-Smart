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
exports.ExamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_paper_entity_1 = require("./entities/exam-paper.entity");
const exam_record_entity_1 = require("./entities/exam-record.entity");
const question_entity_1 = require("../question/entities/question.entity");
const business_exception_1 = require("../../common/exceptions/business.exception");
let ExamService = class ExamService {
    constructor(examPaperRepository, examRecordRepository, questionRepository) {
        this.examPaperRepository = examPaperRepository;
        this.examRecordRepository = examRecordRepository;
        this.questionRepository = questionRepository;
    }
    async getExamPapers() {
        return this.examPaperRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' }
        });
    }
    async generateExamPaper(userId, examConfig) {
        const questions = await this.questionRepository
            .createQueryBuilder('q')
            .where('q.isActive = :isActive', { isActive: true })
            .orderBy('RANDOM()')
            .take(examConfig.questionCount || 20)
            .getMany();
        const paper = this.examPaperRepository.create({
            title: `${examConfig.type || '综合'}考试`,
            description: '系统生成的考试试卷',
            type: 'mock',
            questionIds: questions.map(q => q.id),
            duration: examConfig.timeLimit || 120,
            totalScore: 100,
            passScore: 60,
            isActive: true
        });
        const savedPaper = await this.examPaperRepository.save(paper);
        return {
            ...savedPaper,
            questions: questions
        };
    }
    async submitExam(userId, paperId, answers, timeSpent) {
        const paper = await this.examPaperRepository.findOne({
            where: { id: paperId }
        });
        if (!paper) {
            throw business_exception_1.BusinessException.notFoundError('考试试卷不存在');
        }
        const score = this.calculateScore(answers, paper.questionIds);
        const record = this.examRecordRepository.create({
            userId,
            examPaperId: paperId,
            userAnswers: answers.map(a => ({
                questionId: a.questionId || 0,
                answer: a.answer || '',
                timeSpent: a.timeSpent || 0
            })),
            totalScore: paper.totalScore,
            userScore: score,
            correctCount: Math.floor(score / 100 * paper.questionIds.length),
            totalCount: paper.questionIds.length,
            timeUsed: timeSpent,
            status: 'completed',
            startTime: new Date(),
            endTime: new Date()
        });
        const savedRecord = await this.examRecordRepository.save(record);
        return {
            recordId: savedRecord.id,
            score: savedRecord.userScore,
            passed: savedRecord.userScore >= 60,
            timeSpent: savedRecord.timeUsed
        };
    }
    async getExamRecords(userId) {
        return this.examRecordRepository.find({
            where: { userId },
            relations: ['examPaper'],
            order: { createdAt: 'DESC' }
        });
    }
    async getExamAnalysis(recordId) {
        const record = await this.examRecordRepository.findOne({
            where: { id: recordId },
            relations: ['examPaper', 'user']
        });
        if (!record) {
            throw business_exception_1.BusinessException.notFoundError('考试记录不存在', { recordId });
        }
        return {
            record,
            analysis: {
                totalQuestions: record.totalCount,
                correctAnswers: record.correctCount,
                accuracy: record.userScore,
                timeEfficiency: record.timeUsed / record.examPaper.duration * 100,
                weakPoints: []
            }
        };
    }
    calculateScore(answers, questionIds) {
        return Math.floor(Math.random() * 40) + 60;
    }
    async getExamStats(userId) {
        const records = await this.examRecordRepository.find({
            where: { userId },
            relations: ['examPaper']
        });
        const totalExams = records.length;
        const passedExams = records.filter(r => r.userScore >= 60).length;
        const averageScore = totalExams > 0
            ? records.reduce((sum, r) => sum + r.userScore, 0) / totalExams
            : 0;
        return {
            totalExams,
            passedExams,
            passRate: totalExams > 0 ? (passedExams / totalExams * 100).toFixed(1) : '0',
            averageScore: averageScore.toFixed(1),
            bestScore: totalExams > 0 ? Math.max(...records.map(r => r.userScore)) : 0
        };
    }
    async generateMockExam(userId, config) {
        return this.generateExamPaper(userId, {
            type: '模拟考试',
            questionCount: config.questionCount || 30,
            timeLimit: config.timeLimit || 150,
            ...config
        });
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_paper_entity_1.ExamPaper)),
    __param(1, (0, typeorm_1.InjectRepository)(exam_record_entity_1.ExamRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExamService);
//# sourceMappingURL=exam.service.js.map