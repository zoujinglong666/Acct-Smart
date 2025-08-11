"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = exports.ERROR_MESSAGES = exports.ErrorCode = void 0;
const common_1 = require("@nestjs/common");
const base_response_dto_1 = require("../dto/base-response.dto");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["PARAMS_ERROR"] = 40000] = "PARAMS_ERROR";
    ErrorCode[ErrorCode["NOT_LOGIN_ERROR"] = 40100] = "NOT_LOGIN_ERROR";
    ErrorCode[ErrorCode["NO_AUTH_ERROR"] = 40101] = "NO_AUTH_ERROR";
    ErrorCode[ErrorCode["NOT_FOUND_ERROR"] = 40400] = "NOT_FOUND_ERROR";
    ErrorCode[ErrorCode["FORBIDDEN_ERROR"] = 40300] = "FORBIDDEN_ERROR";
    ErrorCode[ErrorCode["SYSTEM_ERROR"] = 50000] = "SYSTEM_ERROR";
    ErrorCode[ErrorCode["OPERATION_ERROR"] = 50001] = "OPERATION_ERROR";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.ERROR_MESSAGES = {
    [ErrorCode.SUCCESS]: 'ok',
    [ErrorCode.PARAMS_ERROR]: '请求参数错误',
    [ErrorCode.NOT_LOGIN_ERROR]: '未登录',
    [ErrorCode.NO_AUTH_ERROR]: '无权限',
    [ErrorCode.NOT_FOUND_ERROR]: '请求数据不存在',
    [ErrorCode.FORBIDDEN_ERROR]: '禁止访问',
    [ErrorCode.SYSTEM_ERROR]: '系统内部异常',
    [ErrorCode.OPERATION_ERROR]: '操作失败',
};
class BusinessException extends common_1.HttpException {
    constructor(code, message, data, httpStatus = common_1.HttpStatus.OK) {
        const errorMessage = message || exports.ERROR_MESSAGES[code] || '未知错误';
        super(errorMessage, httpStatus);
        this.errorCode = code;
        this.errorData = data;
    }
    getErrorCode() {
        return this.errorCode;
    }
    getErrorData() {
        return this.errorData;
    }
    toResponse() {
        return base_response_dto_1.BaseResponse.error(this.errorCode, this.message);
    }
    static paramsError(message, data) {
        return new BusinessException(ErrorCode.PARAMS_ERROR, message, data);
    }
    static notLoginError(message, data) {
        return new BusinessException(ErrorCode.NOT_LOGIN_ERROR, message, data);
    }
    static noAuthError(message, data) {
        return new BusinessException(ErrorCode.NO_AUTH_ERROR, message, data);
    }
    static notFoundError(message, data) {
        return new BusinessException(ErrorCode.NOT_FOUND_ERROR, message, data);
    }
    static forbiddenError(message, data) {
        return new BusinessException(ErrorCode.FORBIDDEN_ERROR, message, data);
    }
    static systemError(message, data) {
        return new BusinessException(ErrorCode.SYSTEM_ERROR, message, data);
    }
    static operationError(message, data) {
        return new BusinessException(ErrorCode.OPERATION_ERROR, message, data);
    }
}
exports.BusinessException = BusinessException;
//# sourceMappingURL=business.exception.js.map