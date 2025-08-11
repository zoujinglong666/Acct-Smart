import { StudyService } from './study.service';
import { User } from '../user/entities/user.entity';
export declare class StudyController {
    private readonly studyService;
    constructor(studyService: StudyService);
    getStudyRecords(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-record.entity").StudyRecord[]>>;
    createStudyRecord(user: User, recordData: {
        studyTime: number;
        completedQuestions: number;
        accuracy: number;
        subjects: string[];
    }): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-record.entity").StudyRecord>>;
    getWrongQuestions(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/wrong-question.entity").WrongQuestion[]>>;
    addWrongQuestion(user: User, wrongQuestionData: {
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        explanation: string;
    }): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/wrong-question.entity").WrongQuestion>>;
    markWrongQuestionMastered(user: User, id: string): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/wrong-question.entity").WrongQuestion>>;
    deleteWrongQuestion(user: User, id: string): Promise<import("../../common/dto/base-response.dto").BaseResponse<any>>;
    getStudyPlans(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-plan.entity").StudyPlan[]>>;
    createStudyPlan(user: User, planData: {
        name: string;
        description: string;
        targetDays: number;
        dailyGoal: number;
    }): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-plan.entity").StudyPlan>>;
    updateStudyPlan(user: User, id: string, planData: any): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-plan.entity").StudyPlan>>;
    completeStudyPlan(user: User, id: string): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-plan.entity").StudyPlan>>;
    getTodayStatus(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<{
        hasStudiedToday: boolean;
        todayStudyTime: number;
        todayQuestions: number;
        todayAccuracy: number;
    }>>;
    saveDailyRecord(user: User, recordData: {
        studyTime: number;
        completedQuestions: number;
        accuracy: number;
    }): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-record.entity").StudyRecord>>;
}
