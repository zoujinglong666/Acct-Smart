"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const question_service_1 = require("./question.service");
const question_controller_1 = require("./question.controller");
const question_entity_1 = require("./entities/question.entity");
const study_record_entity_1 = require("../study/entities/study-record.entity");
const wrong_question_entity_1 = require("../study/entities/wrong-question.entity");
const knowledge_point_entity_1 = require("../knowledge/entities/knowledge-point.entity");
const user_module_1 = require("../user/user.module");
let QuestionModule = class QuestionModule {
};
exports.QuestionModule = QuestionModule;
exports.QuestionModule = QuestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                question_entity_1.Question,
                study_record_entity_1.StudyRecord,
                wrong_question_entity_1.WrongQuestion,
                knowledge_point_entity_1.KnowledgePoint
            ]),
            user_module_1.UserModule
        ],
        controllers: [question_controller_1.QuestionController],
        providers: [question_service_1.QuestionService],
        exports: [question_service_1.QuestionService]
    })
], QuestionModule);
//# sourceMappingURL=question.module.js.map