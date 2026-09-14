import { BaseEntity } from '../../../common/entities/base.entity';
import { ExamRecord } from './exam-record.entity';
export declare class ExamPaper extends BaseEntity {
    title: string;
    description: string;
    type: 'mock' | 'sprint' | 'daily';
    questionIds: number[];
    duration: number;
    totalScore: number;
    passScore: number;
    questionDistribution: {
        single: number;
        multiple: number;
        judge: number;
        calculation: number;
    };
    isActive: boolean;
    instructions: string[];
    examRecords: ExamRecord[];
}
