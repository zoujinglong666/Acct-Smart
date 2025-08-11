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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("../question/entities/question.entity");
const study_record_entity_1 = require("../study/entities/study-record.entity");
const wrong_question_entity_1 = require("../study/entities/wrong-question.entity");
let AnalyticsService = class AnalyticsService {
    constructor(questionRepository, studyRecordRepository, wrongQuestionRepository) {
        this.questionRepository = questionRepository;
        this.studyRecordRepository = studyRecordRepository;
        this.wrongQuestionRepository = wrongQuestionRepository;
    }
    async getHighFrequencyWrongQuestions(limit = 50) {
        const query = `
      SELECT 
        q.*,
        COUNT(sr.id) as total_attempts,
        COUNT(CASE WHEN sr.is_correct = false THEN 1 END) as wrong_count,
        ROUND(
          COUNT(CASE WHEN sr.is_correct = false THEN 1 END) * 100.0 / COUNT(sr.id), 
          2
        ) as error_rate
      FROM questions q
      LEFT JOIN study_records sr ON q.id = sr.question_id
      WHERE sr.id IS NOT NULL
      GROUP BY q.id
      HAVING COUNT(sr.id) >= 10
      ORDER BY error_rate DESC, wrong_count DESC
      LIMIT $1
    `;
        const result = await this.questionRepository.query(query, [limit]);
        return result;
    }
    async getUserWrongQuestionAnalysis(userId) {
        const wrongStats = await this.wrongQuestionRepository
            .createQueryBuilder('wq')
            .leftJoinAndSelect('wq.question', 'q')
            .leftJoinAndSelect('q.knowledgePoint', 'kp')
            .where('wq.userId = :userId', { userId })
            .andWhere('wq.isMastered = false')
            .orderBy('wq.wrongCount', 'DESC')
            .getMany();
        const knowledgePointStats = {};
        wrongStats.forEach(item => {
            const kpId = item.question.knowledgePointId;
            if (!knowledgePointStats[kpId]) {
                knowledgePointStats[kpId] = {
                    knowledgePoint: item.question.knowledgePoint,
                    wrongCount: 0,
                    questions: []
                };
            }
            knowledgePointStats[kpId].wrongCount += item.wrongCount;
            knowledgePointStats[kpId].questions.push(item);
        });
        return {
            totalWrongQuestions: wrongStats.length,
            wrongQuestions: wrongStats,
            weakKnowledgePoints: Object.values(knowledgePointStats)
                .sort((a, b) => b.wrongCount - a.wrongCount)
                .slice(0, 10)
        };
    }
    async analyzeWrongReasons(userId, questionId) {
        const records = await this.studyRecordRepository.find({
            where: { userId, questionId, isCorrect: false },
            order: { createdAt: 'DESC' },
            take: 5
        });
        if (records.length === 0) {
            return { reasons: [], suggestions: [] };
        }
        const reasons = [];
        const timeSpents = records.map(r => r.timeSpent);
        const avgTime = timeSpents.reduce((a, b) => a + b, 0) / timeSpents.length;
        if (avgTime < 30) {
            reasons.push('答题过快，可能存在粗心问题');
        }
        else if (avgTime > 300) {
            reasons.push('答题时间过长，可能概念不清晰');
        }
        if (records.length >= 3) {
            reasons.push('多次答错，需要重点复习相关知识点');
        }
        const suggestions = [
            '重新学习相关知识点',
            '做类似题目加强练习',
            '总结解题方法和技巧',
            '制作错题笔记'
        ];
        return { reasons, suggestions };
    }
    calculateReviewSchedule(lastWrongTime) {
        const schedule = [];
        const baseTime = new Date(lastWrongTime);
        const intervals = [1, 3, 7, 15, 30];
        intervals.forEach(days => {
            const reviewTime = new Date(baseTime);
            reviewTime.setDate(reviewTime.getDate() + days);
            schedule.push(reviewTime);
        });
        return schedule;
    }
    async getTodayReviewQuestions(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        const reviewQuestions = await this.wrongQuestionRepository
            .createQueryBuilder('wq')
            .leftJoinAndSelect('wq.question', 'q')
            .where('wq.userId = :userId', { userId })
            .andWhere('wq.isMastered = false')
            .andWhere('(DATE(wq.lastWrongTime) = DATE(:threeDaysAgo) OR DATE(wq.lastWrongTime) = DATE(:sevenDaysAgo) OR DATE(wq.lastWrongTime) = DATE(:fifteenDaysAgo))', { threeDaysAgo, sevenDaysAgo, fifteenDaysAgo })
            .orderBy('wq.wrongCount', 'DESC')
            .getMany();
        return reviewQuestions;
    }
    async getStudyStatistics(userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const dailyStats = await this.studyRecordRepository
            .createQueryBuilder('sr')
            .select([
            'DATE(sr.createdAt) as date',
            'COUNT(*) as questionCount',
            'COUNT(CASE WHEN sr.isCorrect = true THEN 1 END) as correctCount',
            'AVG(sr.timeSpent) as avgTimeSpent'
        ])
            .where('sr.userId = :userId', { userId })
            .andWhere('sr.createdAt >= :startDate', { startDate })
            .groupBy('DATE(sr.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return dailyStats;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(1, (0, typeorm_1.InjectRepository)(study_record_entity_1.StudyRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(wrong_question_entity_1.WrongQuestion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map