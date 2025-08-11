import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../dto/base-response.dto';
export declare enum ErrorCode {
    SUCCESS = 0,
    PARAMS_ERROR = 40000,
    NOT_LOGIN_ERROR = 40100,
    NO_AUTH_ERROR = 40101,
    NOT_FOUND_ERROR = 40400,
    FORBIDDEN_ERROR = 40300,
    SYSTEM_ERROR = 50000,
    OPERATION_ERROR = 50001
}
export declare const ERROR_MESSAGES: Record<ErrorCode, string>;
export declare class BusinessException extends HttpException {
    private readonly errorCode;
    private readonly errorData?;
    constructor(code: ErrorCode, message?: string, data?: any, httpStatus?: HttpStatus);
    getErrorCode(): ErrorCode;
    getErrorData(): any;
    toResponse(): BaseResponse<any>;
    static paramsError(message?: string, data?: any): BusinessException;
    static notLoginError(message?: string, data?: any): BusinessException;
    static noAuthError(message?: string, data?: any): BusinessException;
    static notFoundError(message?: string, data?: any): BusinessException;
    static forbiddenError(message?: string, data?: any): BusinessException;
    static systemError(message?: string, data?: any): BusinessException;
    static operationError(message?: string, data?: any): BusinessException;
}
