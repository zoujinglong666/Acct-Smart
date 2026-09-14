"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = exports.HttpExceptionFilter = exports.BusinessExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const business_exception_1 = require("../exceptions/business.exception");
const base_response_dto_1 = require("../dto/base-response.dto");
let BusinessExceptionFilter = class BusinessExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const errorResponse = exception.toResponse();
        response
            .status(common_1.HttpStatus.OK)
            .json(errorResponse);
    }
};
exports.BusinessExceptionFilter = BusinessExceptionFilter;
exports.BusinessExceptionFilter = BusinessExceptionFilter = __decorate([
    (0, common_1.Catch)(business_exception_1.BusinessException)
], BusinessExceptionFilter);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        let errorCode = business_exception_1.ErrorCode.SYSTEM_ERROR;
        let message = exception.message;
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                errorCode = business_exception_1.ErrorCode.PARAMS_ERROR;
                break;
            case common_1.HttpStatus.UNAUTHORIZED:
                errorCode = business_exception_1.ErrorCode.NOT_LOGIN_ERROR;
                break;
            case common_1.HttpStatus.FORBIDDEN:
                errorCode = business_exception_1.ErrorCode.NO_AUTH_ERROR;
                break;
            case common_1.HttpStatus.NOT_FOUND:
                errorCode = business_exception_1.ErrorCode.NOT_FOUND_ERROR;
                break;
            case common_1.HttpStatus.INTERNAL_SERVER_ERROR:
                errorCode = business_exception_1.ErrorCode.SYSTEM_ERROR;
                break;
        }
        const errorResponse = base_response_dto_1.BaseResponse.error(errorCode, message);
        response
            .status(common_1.HttpStatus.OK)
            .json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        console.error('Unhandled exception:', exception);
        const errorResponse = base_response_dto_1.BaseResponse.error(business_exception_1.ErrorCode.SYSTEM_ERROR, '系统内部异常');
        response
            .status(common_1.HttpStatus.OK)
            .json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=business-exception.filter.js.map