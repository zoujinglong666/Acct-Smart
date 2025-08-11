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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const business_exception_1 = require("../../common/exceptions/business.exception");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const crypto = require("crypto");
let OcrService = class OcrService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.region = 'ap-beijing';
        this.secretId = this.configService.get('TENCENT_SECRET_ID');
        this.secretKey = this.configService.get('TENCENT_SECRET_KEY');
    }
    async recognizeText(imageBase64) {
        try {
            const endpoint = 'ocr.tencentcloudapi.com';
            const service = 'ocr';
            const version = '2018-11-19';
            const action = 'GeneralBasicOCR';
            const timestamp = Math.floor(Date.now() / 1000);
            const date = new Date(timestamp * 1000).toISOString().substr(0, 10);
            const payload = {
                ImageBase64: imageBase64,
                LanguageType: 'zh',
                Scene: 'doc'
            };
            const authorization = this.generateSignature(endpoint, service, version, action, timestamp, date, JSON.stringify(payload));
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`https://${endpoint}`, payload, {
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Host': endpoint,
                    'X-TC-Action': action,
                    'X-TC-Timestamp': timestamp.toString(),
                    'X-TC-Version': version,
                    'X-TC-Region': this.region,
                },
            }));
            if (response.data.Response.Error) {
                throw business_exception_1.BusinessException.operationError(response.data.Response.Error.Message);
            }
            const textDetections = response.data.Response.TextDetections || [];
            return textDetections.map(item => item.DetectedText).join('\n');
        }
        catch (error) {
            console.error('OCR识别失败:', error);
            throw business_exception_1.BusinessException.operationError('图片识别失败', { error: error.message });
        }
    }
    generateSignature(endpoint, service, version, action, timestamp, date, payload) {
        const httpRequestMethod = 'POST';
        const canonicalUri = '/';
        const canonicalQueryString = '';
        const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${endpoint}\n`;
        const signedHeaders = 'content-type;host';
        const hashedRequestPayload = crypto.createHash('sha256').update(payload).digest('hex');
        const canonicalRequest = [
            httpRequestMethod,
            canonicalUri,
            canonicalQueryString,
            canonicalHeaders,
            signedHeaders,
            hashedRequestPayload
        ].join('\n');
        const algorithm = 'TC3-HMAC-SHA256';
        const credentialScope = `${date}/${service}/tc3_request`;
        const hashedCanonicalRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
        const stringToSign = [
            algorithm,
            timestamp,
            credentialScope,
            hashedCanonicalRequest
        ].join('\n');
        const secretDate = crypto.createHmac('sha256', `TC3${this.secretKey}`).update(date).digest();
        const secretService = crypto.createHmac('sha256', secretDate).update(service).digest();
        const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest();
        const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');
        return `${algorithm} Credential=${this.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }
    async parseQuestionStructure(text) {
        const questionPattern = /(\d+[\.、])\s*(.+?)(?=\n[A-D][\.、]|$)/s;
        const optionPattern = /([A-D])[\.、]\s*(.+?)(?=\n[A-D][\.、]|\n\n|$)/g;
        const questionMatch = text.match(questionPattern);
        if (!questionMatch) {
            return { question: text, options: [], type: 'unknown' };
        }
        const question = questionMatch[2].trim();
        const options = [];
        let optionMatch;
        while ((optionMatch = optionPattern.exec(text)) !== null) {
            options.push({
                key: optionMatch[1],
                text: optionMatch[2].trim()
            });
        }
        let type = 'single';
        if (options.length === 0) {
            type = text.includes('正确') || text.includes('错误') ? 'judge' : 'calculation';
        }
        else if (text.includes('多选') || text.includes('多项')) {
            type = 'multiple';
        }
        return {
            question,
            options,
            type,
            originalText: text
        };
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map