import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class OcrService {
    private configService;
    private httpService;
    private readonly secretId;
    private readonly secretKey;
    private readonly region;
    constructor(configService: ConfigService, httpService: HttpService);
    recognizeText(imageBase64: string): Promise<string>;
    private generateSignature;
    parseQuestionStructure(text: string): Promise<any>;
}
