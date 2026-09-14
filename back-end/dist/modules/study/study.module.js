"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const study_record_entity_1 = require("./entities/study-record.entity");
const wrong_question_entity_1 = require("./entities/wrong-question.entity");
const study_controller_1 = require("./study.controller");
const study_service_1 = require("./study.service");
let StudyModule = class StudyModule {
};
exports.StudyModule = StudyModule;
exports.StudyModule = StudyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                study_record_entity_1.StudyRecord,
                wrong_question_entity_1.WrongQuestion
            ])
        ],
        controllers: [study_controller_1.StudyController],
        providers: [study_service_1.StudyService],
        exports: [study_service_1.StudyService, typeorm_1.TypeOrmModule]
    })
], StudyModule);
//# sourceMappingURL=study.module.js.map