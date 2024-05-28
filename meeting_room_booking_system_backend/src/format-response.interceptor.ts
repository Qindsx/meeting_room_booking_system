import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map,Observable } from 'rxjs';
import { Response } from 'express';


// 将Response 返回信息封装
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // return next.handle();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(map((data) => {
      return {
        code: response.statusCode,
        message: 'success',
        data
      }
    }));

  }
}
