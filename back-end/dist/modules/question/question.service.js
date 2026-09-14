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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const business_exception_1 = require("../../common/exceptions/business.exception");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("./entities/question.entity");
let QuestionService = class QuestionService {
    constructor(questionRepository) {
        this.questionRepository = questionRepository;
    }
    async findAll(page = 1, limit = 20, filters) {
        const queryBuilder = this.questionRepository
            .createQueryBuilder('q')
            .leftJoinAndSelect('q.knowledgePoint', 'kp')
            .where('q.isActive = :isActive', { isActive: true });
        if (filters?.type) {
            queryBuilder.andWhere('q.type = :type', { type: filters.type });
        }
        if (filters?.difficulty) {
            queryBuilder.andWhere('q.difficulty = :difficulty', { difficulty: filters.difficulty });
        }
        if (filters?.knowledgePointId) {
            queryBuilder.andWhere('q.knowledgePointId = :knowledgePointId', {
                knowledgePointId: filters.knowledgePointId
            });
        }
        const [questions, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('q.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data: questions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['knowledgePoint'],
        });
        if (!question) {
            throw business_exception_1.BusinessException.notFoundError('题目不存在');
        }
        return question;
    }
    async getRandomQuestions(count = 5, filters) {
        const queryBuilder = this.questionRepository
            .createQueryBuilder('q')
            .leftJoinAndSelect('q.knowledgePoint', 'kp')
            .where('q.isActive = :isActive', { isActive: true });
        if (filters?.type) {
            queryBuilder.andWhere('q.type = :type', { type: filters.type });
        }
        if (filters?.difficulty) {
            queryBuilder.andWhere('q.difficulty = :difficulty', { difficulty: filters.difficulty });
        }
        if (filters?.knowledgePointIds && filters.knowledgePointIds.length > 0) {
            queryBuilder.andWhere('q.knowledgePointId IN (:...ids)', {
                ids: filters.knowledgePointIds
            });
        }
        return queryBuilder
            .orderBy('RANDOM()')
            .take(count)
            .getMany();
    }
    async updateQuestionStats(id, isCorrect) {
        const updateData = {
            answerCount: () => 'answer_count + 1',
        };
        if (isCorrect) {
            updateData.correctCount = () => 'correct_count + 1';
        }
        await this.questionRepository
            .createQueryBuilder()
            .update(question_entity_1.Question)
            .set(updateData)
            .where('id = :id', { id })
            .execute();
    }
    async saveOcrQuestion(questionData) {
        const question = this.questionRepository.create({
            content: questionData.question,
            type: questionData.type || 'single',
            options: questionData.options || [],
            correctAnswer: questionData.correctAnswer || '',
            explanation: questionData.analysis || '',
            knowledgePointId: questionData.knowledgePointId || 1,
            difficulty: 'medium',
            source: 'OCR识别',
        });
        return this.questionRepository.save(question);
    }
    async getDailyQuestions(userId) {
        return this.getRandomQuestions(5, { type: 'single' });
    }
    async getWrongQuestions(userId) {
        return [];
    }
    async getHighFrequencyWrongQuestions(userId) {
        return [];
    }
    async getQuestionsByKnowledgePoint(knowledgePointId) {
        return this.questionRepository.find({
            where: { knowledgePointId: parseInt(knowledgePointId) },
            relations: ['knowledgePoint']
        });
    }
    async submitAnswer(userId, questionId, userAnswer, isCorrect, timeSpent) {
        await this.updateQuestionStats(parseInt(questionId), isCorrect);
        return {
            success: true,
            isCorrect,
            explanation: '答案解析...'
        };
    }
    async getQuestionAnalysis(questionId) {
        const question = await this.findOne(parseInt(questionId));
        return {
            question,
            analysis: question.explanation,
            difficulty: question.difficulty,
            correctRate: question.answerCount > 0 ? (question.correctCount / question.answerCount * 100).toFixed(1) : '0'
        };
    }
    async searchQuestions(keyword, difficulty, knowledgePointId) {
        const queryBuilder = this.questionRepository
            .createQueryBuilder('q')
            .leftJoinAndSelect('q.knowledgePoint', 'kp')
            .where('q.isActive = :isActive', { isActive: true });
        if (keyword) {
            queryBuilder.andWhere('q.content LIKE :keyword', { keyword: `%${keyword}%` });
        }
        if (difficulty) {
            queryBuilder.andWhere('q.difficulty = :difficulty', { difficulty });
        }
        if (knowledgePointId) {
            queryBuilder.andWhere('q.knowledgePointId = :knowledgePointId', {
                knowledgePointId: parseInt(knowledgePointId)
            });
        }
        return queryBuilder
            .orderBy('q.createdAt', 'DESC')
            .take(20)
            .getMany();
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionService);
//# sourceMappingURL=question.service.js.map