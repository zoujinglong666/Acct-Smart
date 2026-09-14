"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exam_service_1 = require("./exam.service");
const exam_controller_1 = require("./exam.controller");
const exam_paper_entity_1 = require("./entities/exam-paper.entity");
const exam_record_entity_1 = require("./entities/exam-record.entity");
const question_entity_1 = require("../question/entities/question.entity");
const user_entity_1 = require("../user/entities/user.entity");
let ExamModule = class ExamModule {
};
exports.ExamModule = ExamModule;
exports.ExamModule = ExamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                exam_paper_entity_1.ExamPaper,
                exam_record_entity_1.ExamRecord,
                question_entity_1.Question,
                user_entity_1.User
            ])
        ],
        controllers: [exam_controller_1.ExamController],
        providers: [exam_service_1.ExamService],
        exports: [exam_service_1.ExamService]
    })
], ExamModule);
//# sourceMappingURL=exam.module.js.map