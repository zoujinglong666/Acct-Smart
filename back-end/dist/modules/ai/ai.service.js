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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const openai_1 = require("openai");
let AiService = class AiService {
    constructor(configService, aiQueue) {
        this.configService = configService;
        this.aiQueue = aiQueue;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
            baseURL: this.configService.get('OPENAI_BASE_URL'),
        });
    }
    async generateExplanation(knowledgePoint, content) {
        const prompt = `
作为一名专业的中级会计师培训讲师，请为以下知识点提供详细的讲解：

知识点：${knowledgePoint}
内容概要：${content}

请按以下格式提供讲解：
1. 核心概念解释
2. 重点难点分析
3. 实际应用场景
4. 记忆技巧
5. 常见考点提示

要求：
- 语言通俗易懂，适合中级会计考生理解
- 结合实际案例说明
- 突出考试重点
- 字数控制在800字以内
`;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || '生成讲解失败';
        }
        catch (error) {
            console.error('AI讲解生成失败:', error);
            return '抱歉，AI讲解服务暂时不可用，请稍后重试。';
        }
    }
    async generateQuestionAnalysis(question, correctAnswer, userAnswer) {
        const prompt = `
作为中级会计考试专家，请为以下题目提供详细解析：

题目：${question}
正确答案：${correctAnswer}
用户答案：${userAnswer}

请提供：
1. 题目考查的知识点
2. 正确答案的详细解析过程
3. 如果用户答错，分析错误原因
4. 相关知识点补充
5. 类似题型的解题技巧

要求：
- 解析清晰易懂
- 突出解题思路
- 提供记忆要点
- 字数控制在600字以内
`;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1200,
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || '生成解析失败';
        }
        catch (error) {
            console.error('AI解析生成失败:', error);
            return '抱歉，AI解析服务暂时不可用，请稍后重试。';
        }
    }
    async answerQuestion(question, context) {
        const prompt = `
作为专业的中级会计师，请回答以下问题：

问题：${question}
${context ? `相关背景：${context}` : ''}

请提供：
1. 直接回答问题
2. 详细解释相关概念
3. 如有必要，提供计算过程
4. 相关法规或准则依据
5. 实务中的注意事项

要求：
- 回答准确专业
- 语言简洁明了
- 突出重点内容
- 字数控制在500字以内
`;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || '回答生成失败';
        }
        catch (error) {
            console.error('AI答疑失败:', error);
            return '抱歉，AI答疑服务暂时不可用，请稍后重试。';
        }
    }
    async generateContentAsync(type, data) {
        const job = await this.aiQueue.add('generate-content', {
            type,
            data,
            timestamp: new Date(),
        });
        return { jobId: job.id };
    }
    async generateStudyAdvice(wrongQuestions, studyTime, progress) {
        const prompt = `
基于用户的学习数据，请提供个性化的学习建议：

错题分析：
${wrongQuestions.map(q => `- ${q.question}: ${q.wrongCount}次错误`).join('\n')}

学习时长：${studyTime}分钟
学习进度：${JSON.stringify(progress)}

请提供：
1. 薄弱知识点分析
2. 学习重点建议
3. 复习计划安排
4. 提高方法指导
5. 考试策略建议

要求：
- 建议具体可行
- 针对性强
- 鼓励性语言
- 字数控制在400字以内
`;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 800,
                temperature: 0.8,
            });
            return response.choices[0]?.message?.content || '建议生成失败';
        }
        catch (error) {
            console.error('学习建议生成失败:', error);
            return '抱歉，学习建议服务暂时不可用，请稍后重试。';
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('ai-tasks')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], AiService);
//# sourceMappingURL=ai.service.js.map