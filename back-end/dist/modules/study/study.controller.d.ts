import { StudyService } from './study.service';
import { User } from '../user/entities/user.entity';
export declare class StudyController {
    private readonly studyService;
    constructor(studyService: StudyService);
    getStudyRecords(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/study-record.entity").StudyRecord[]>>;
    getWrongQuestions(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/wrong-question.entity").WrongQuestion[]>>;
    addWrongQuestion(user: User, wrongQuestionData: {
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        explanation: string;
    }): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/wrong-question.entity").WrongQuestion>>;
    markWrongQuestionMastered(user: User, id: string): Promise<import("../../common/dto/base-response.dto").BaseResponse<import("./entities/wrong-question.entity").WrongQuestion>>;
    deleteWrongQuestion(user: User, id: string): Promise<import("../../common/dto/base-response.dto").BaseResponse<any>>;
    getTodayStatus(user: User): Promise<import("../../common/dto/base-response.dto").BaseResponse<{
        hasStudiedToday: boolean;
        todayQuestions: number;
        todayCorrect: number;
        todayAccuracy: number;
        todayStudyTime: number;
    }>>;
}
