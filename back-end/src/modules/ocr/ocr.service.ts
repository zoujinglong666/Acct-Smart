import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class OcrService {
  private readonly secretId: string;
  private readonly secretKey: string;
  private readonly region: string = 'ap-beijing';

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.secretId = this.configService.get<string>('TENCENT_SECRET_ID');
    this.secretKey = this.configService.get<string>('TENCENT_SECRET_KEY');
  }

  /**
   * 腾讯云OCR识别图片文字
   */
  async recognizeText(imageBase64: string): Promise<string> {
    try {
      const endpoint = 'ocr.tencentcloudapi.com';
      const service = 'ocr';
      const version = '2018-11-19';
      const action = 'GeneralBasicOCR';
      
      const timestamp = Math.floor(Date.now() / 1000);
      const date = new Date(timestamp * 1000).toISOString().substr(0, 10);

      // 构建请求参数
      const payload = {
        ImageBase64: imageBase64,
        LanguageType: 'zh',
        Scene: 'doc'
      };

      // 生成签名
      const authorization = this.generateSignature(
        endpoint,
        service,
        version,
        action,
        timestamp,
        date,
        JSON.stringify(payload)
      );

      const response = await firstValueFrom(
        this.httpService.post(`https://${endpoint}`, payload, {
          headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json; charset=utf-8',
            'Host': endpoint,
            'X-TC-Action': action,
            'X-TC-Timestamp': timestamp.toString(),
            'X-TC-Version': version,
            'X-TC-Region': this.region,
          },
        })
      );

      if (response.data.Response.Error) {
        throw BusinessException.operationError(response.data.Response.Error.Message);
      }

      // 提取识别的文字
      const textDetections = response.data.Response.TextDetections || [];
      return textDetections.map(item => item.DetectedText).join('\n');

    } catch (error) {
      console.error('OCR识别失败:', error);
      throw BusinessException.operationError('图片识别失败', { error: error.message });
    }
  }

  /**
   * 生成腾讯云API签名
   */
  private generateSignature(
    endpoint: string,
    service: string,
    version: string,
    action: string,
    timestamp: number,
    date: string,
    payload: string
  ): string {
    // 步骤1：拼接规范请求串
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

    // 步骤2：拼接待签名字符串
    const algorithm = 'TC3-HMAC-SHA256';
    const credentialScope = `${date}/${service}/tc3_request`;
    const hashedCanonicalRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
    
    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      hashedCanonicalRequest
    ].join('\n');

    // 步骤3：计算签名
    const secretDate = crypto.createHmac('sha256', `TC3${this.secretKey}`).update(date).digest();
    const secretService = crypto.createHmac('sha256', secretDate).update(service).digest();
    const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest();
    const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

    // 步骤4：拼接Authorization
    return `${algorithm} Credential=${this.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }

  /**
   * 智能解析题目结构
   */
  async parseQuestionStructure(text: string): Promise<any> {
    // 使用正则表达式解析题目结构
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

    // 判断题目类型
    let type = 'single';
    if (options.length === 0) {
      type = text.includes('正确') || text.includes('错误') ? 'judge' : 'calculation';
    } else if (text.includes('多选') || text.includes('多项')) {
      type = 'multiple';
    }

    return {
      question,
      options,
      type,
      originalText: text
    };
  }
}