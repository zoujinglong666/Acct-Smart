import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException, ErrorCode } from '../../../common/exceptions/business.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // 如果有错误或者用户不存在，抛出业务异常
    if (err || !user) {
      let message = '未登录或登录已过期';
      
      if (info) {
        switch (info.name) {
          case 'TokenExpiredError':
            message = '登录已过期，请重新登录';
            break;
          case 'JsonWebTokenError':
            message = '无效的登录凭证';
            break;
          case 'NotBeforeError':
            message = '登录凭证尚未生效';
            break;
          default:
            message = '认证失败';
        }
      }
      
      throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, message);
    }
    
    return user;
  }
}
