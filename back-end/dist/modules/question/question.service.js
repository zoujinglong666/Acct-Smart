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
const study_record_entity_1 = require("../study/entities/study-record.entity");
const wrong_question_entity_1 = require("../study/entities/wrong-question.entity");
const user_service_1 = require("../user/user.service");
let QuestionService = class QuestionService {
    constructor(questionRepository, studyRecordRepository, wrongQuestionRepository, userService) {
        this.questionRepository = questionRepository;
        this.studyRecordRepository = studyRecordRepository;
        this.wrongQuestionRepository = wrongQuestionRepository;
        this.userService = userService;
    }
    async getDailyQuestions(userId) {
        return this.getRandomQuestions(5, { type: 'single' });
    }
    async getRandomQuestions(count = 5, filters) {
        const queryBuilder = this.questionRepository
            .createQueryBuilder('q')
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
        return queryBuilder
            .orderBy('RANDOM()')
            .take(count)
            .getMany();
    }
    async getQuestionsByKnowledgePoint(knowledgePointId) {
        return this.questionRepository.find({
            where: { knowledgePointId: parseInt(knowledgePointId), isActive: true },
            relations: ['knowledgePoint']
        });
    }
    async submitAnswer(userId, questionId, userAnswer, timeSpent) {
        const question = await this.questionRepository.findOne({
            where: { id: parseInt(questionId), isActive: true }
        });
        if (!question) {
            throw business_exception_1.BusinessException.notFoundError('题目不存在');
        }
        const isCorrect = this.checkAnswer(question, userAnswer);
        const record = this.studyRecordRepository.create({
            userId,
            questionId: question.id,
            userAnswer,
            isCorrect,
            timeSpent: timeSpent || 0,
            type: 'practice'
        });
        await this.studyRecordRepository.save(record);
        if (!isCorrect) {
            await this.upsertWrongQuestion(userId, question, userAnswer);
        }
        await this.updateQuestionStats(question.id, isCorrect);
        await this.userService.updateStudyStats(userId, 0, 1, isCorrect ? 1 : 0);
        return {
            success: true,
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
        };
    }
    checkAnswer(question, userAnswer) {
        if (!userAnswer)
            return false;
        const normalize = (answer) => {
            const a = String(answer).trim().toUpperCase();
            if (/^[A-Z]+$/.test(a))
                return a;
            const m = a.match(/^([A-Z]+)[.．、:：\s]+/);
            return m ? m[1] : a.replace(/[.．、\s]/g, '');
        };
        const user = normalize(userAnswer);
        const correct = normalize(question.correctAnswer || '');
        if (!correct)
            return false;
        if (question.type === 'multiple') {
            return [...user].sort().join('') === [...correct].sort().join('');
        }
        return user === correct;
    }
    async upsertWrongQuestion(userId, question, userAnswer) {
        const existing = await this.wrongQuestionRepository.findOne({
            where: { userId, questionId: question.id }
        });
        if (existing) {
            existing.wrongCount += 1;
            existing.userAnswer = userAnswer;
            existing.lastWrongTime = new Date();
            if (existing.isSolved || existing.isMastered) {
                existing.isSolved = false;
                existing.isMastered = false;
            }
            await this.wrongQuestionRepository.save(existing);
            return;
        }
        const wrongQuestion = this.wrongQuestionRepository.create({
            userId,
            questionId: question.id,
            userAnswer,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            wrongCount: 1,
            isSolved: false
        });
        await this.wrongQuestionRepository.save(wrongQuestion);
    }
    async updateQuestionStats(id, isCorrect) {
        const updateData = {
            answerCount: () => 'answerCount + 1',
        };
        if (isCorrect) {
            updateData.correctCount = () => 'correctCount + 1';
        }
        await this.questionRepository
            .createQueryBuilder()
            .update(question_entity_1.Question)
            .set(updateData)
            .where('id = :id', { id })
            .execute();
    }
    async getQuestionAnalysis(questionId) {
        const question = await this.questionRepository.findOne({
            where: { id: parseInt(questionId) },
            relations: ['knowledgePoint']
        });
        if (!question) {
            throw business_exception_1.BusinessException.notFoundError('题目不存在');
        }
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
    __param(1, (0, typeorm_1.InjectRepository)(study_record_entity_1.StudyRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(wrong_question_entity_1.WrongQuestion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService])
], QuestionService);
//# sourceMappingURL=question.service.js.map