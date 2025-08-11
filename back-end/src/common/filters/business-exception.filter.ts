import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException, ErrorCode } from '../exceptions/business.exception';
import { BaseResponse } from '../dto/base-response.dto';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = exception.toResponse();
    
    response
      .status(HttpStatus.OK) // 统一返回200状态码，通过code区分错误
      .json(errorResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let errorCode = ErrorCode.SYSTEM_ERROR; // 默认系统错误
    let message = exception.message;

    // 根据HTTP状态码映射业务错误码
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        errorCode = ErrorCode.PARAMS_ERROR;
        break;
      case HttpStatus.UNAUTHORIZED:
        errorCode = ErrorCode.NOT_LOGIN_ERROR;
        break;
      case HttpStatus.FORBIDDEN:
        errorCode = ErrorCode.NO_AUTH_ERROR;
        break;
      case HttpStatus.NOT_FOUND:
        errorCode = ErrorCode.NOT_FOUND_ERROR;
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        errorCode = ErrorCode.SYSTEM_ERROR;
        break;
    }

    const errorResponse = BaseResponse.error(errorCode, message);

    response
      .status(HttpStatus.OK) // 统一返回200状态码
      .json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('Unhandled exception:', exception);

    const errorResponse = BaseResponse.error(ErrorCode.SYSTEM_ERROR, '系统内部异常');

    response
      .status(HttpStatus.OK) // 统一返回200状态码
      .json(errorResponse);
  }
}