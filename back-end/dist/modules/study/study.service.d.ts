import { Repository } from 'typeorm';
import { StudyRecord } from './entities/study-record.entity';
import { WrongQuestion } from './entities/wrong-question.entity';
import { BaseResponse } from '../../common/dto/base-response.dto';
export declare class StudyService {
    private studyRecordRepository;
    private wrongQuestionRepository;
    constructor(studyRecordRepository: Repository<StudyRecord>, wrongQuestionRepository: Repository<WrongQuestion>);
    getStudyRecords(userId: number, limit?: number): Promise<BaseResponse<StudyRecord[]>>;
    getWrongQuestions(userId: number): Promise<BaseResponse<WrongQuestion[]>>;
    addWrongQuestion(userId: number, wrongQuestionData: {
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        explanation: string;
    }): Promise<BaseResponse<WrongQuestion>>;
    markWrongQuestionMastered(userId: number, wrongQuestionId: number): Promise<BaseResponse<WrongQuestion>>;
    deleteWrongQuestion(userId: number, wrongQuestionId: number): Promise<BaseResponse<any>>;
    getTodayStatus(userId: number): Promise<BaseResponse<{
        hasStudiedToday: boolean;
        todayQuestions: number;
        todayCorrect: number;
        todayAccuracy: number;
        todayStudyTime: number;
    }>>;
}
