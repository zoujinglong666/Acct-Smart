import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 响应转换拦截器 - 统一处理响应格式和状态码
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // 获取响应对象
        const response = context.switchToHttp().getResponse();
        
        // 统一设置状态码为200
        response.status(HttpStatus.OK);
        
        // 直接返回原始数据，不做额外处理
        return data;
      }),
    );
  }
}