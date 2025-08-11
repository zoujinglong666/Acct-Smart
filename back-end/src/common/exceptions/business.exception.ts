import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../dto/base-response.dto';

/**
 * 错误码枚举 - 类似 Java 中的 ErrorCode
 * 只保留核心的8个错误码，其他使用自定义错误信息
 */
export enum ErrorCode {
  SUCCESS = 0,
  PARAMS_ERROR = 40000,
  NOT_LOGIN_ERROR = 40100,
  NO_AUTH_ERROR = 40101,
  NOT_FOUND_ERROR = 40400,
  FORBIDDEN_ERROR = 40300,
  SYSTEM_ERROR = 50000,
  OPERATION_ERROR = 50001,
}

/**
 * 错误码信息映射
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: 'ok',
  [ErrorCode.PARAMS_ERROR]: '请求参数错误',
  [ErrorCode.NOT_LOGIN_ERROR]: '未登录',
  [ErrorCode.NO_AUTH_ERROR]: '无权限',
  [ErrorCode.NOT_FOUND_ERROR]: '请求数据不存在',
  [ErrorCode.FORBIDDEN_ERROR]: '禁止访问',
  [ErrorCode.SYSTEM_ERROR]: '系统内部异常',
  [ErrorCode.OPERATION_ERROR]: '操作失败',
};

/**
 * 业务异常类 - 类似 Java 中的自定义异常
 */
export class BusinessException extends HttpException {
  private readonly errorCode: ErrorCode;
  private readonly errorData?: any;

  constructor(
    code: ErrorCode,
    message?: string,
    data?: any,
    httpStatus: HttpStatus = HttpStatus.OK // 统一返回200，通过code区分错误
  ) {
    const errorMessage = message || ERROR_MESSAGES[code] || '未知错误';
    super(errorMessage, httpStatus);
    this.errorCode = code;
    this.errorData = data;
  }

  getErrorCode(): ErrorCode {
    return this.errorCode;
  }

  getErrorData(): any {
    return this.errorData;
  }

  /**
   * 转换为统一响应格式
   */
  toResponse(): BaseResponse<any> {
    return BaseResponse.error(this.errorCode, this.message);
  }

  // 静态工厂方法 - 只保留核心的8个错误码
  static paramsError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.PARAMS_ERROR, message, data);
  }

  static notLoginError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.NOT_LOGIN_ERROR, message, data);
  }

  static noAuthError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.NO_AUTH_ERROR, message, data);
  }

  static notFoundError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.NOT_FOUND_ERROR, message, data);
  }

  static forbiddenError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.FORBIDDEN_ERROR, message, data);
  }

  static systemError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.SYSTEM_ERROR, message, data);
  }

  static operationError(message?: string, data?: any): BusinessException {
    return new BusinessException(ErrorCode.OPERATION_ERROR, message, data);
  }
}