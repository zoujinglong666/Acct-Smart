import { Repository } from 'typeorm';
import { StudyRecord } from './entities/study-record.entity';
import { WrongQuestion } from './entities/wrong-question.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { BaseResponse } from '../../common/dto/base-response.dto';
export declare class StudyService {
    private studyRecordRepository;
    private wrongQuestionRepository;
    private studyPlanRepository;
    constructor(studyRecordRepository: Repository<StudyRecord>, wrongQuestionRepository: Repository<WrongQuestion>, studyPlanRepository: Repository<StudyPlan>);
    getStudyRecords(userId: number): Promise<BaseResponse<StudyRecord[]>>;
    createStudyRecord(userId: number, recordData: any): Promise<BaseResponse<StudyRecord>>;
    getWrongQuestions(userId: number): Promise<BaseResponse<WrongQuestion[]>>;
    addWrongQuestion(userId: number, wrongQuestionData: any): Promise<BaseResponse<WrongQuestion>>;
    markWrongQuestionMastered(userId: number, wrongQuestionId: number): Promise<BaseResponse<WrongQuestion>>;
    deleteWrongQuestion(userId: number, wrongQuestionId: number): Promise<BaseResponse<any>>;
    getStudyPlans(userId: number): Promise<BaseResponse<StudyPlan[]>>;
    createStudyPlan(userId: number, planData: any): Promise<BaseResponse<StudyPlan>>;
    updateStudyPlan(userId: number, planId: number, planData: any): Promise<BaseResponse<StudyPlan>>;
    completeStudyPlan(userId: number, planId: number): Promise<BaseResponse<StudyPlan>>;
    getTodayStatus(userId: number): Promise<BaseResponse<{
        hasStudiedToday: boolean;
        todayStudyTime: number;
        todayQuestions: number;
        todayAccuracy: number;
    }>>;
    saveDailyRecord(userId: number, recordData: any): Promise<BaseResponse<StudyRecord>>;
}
