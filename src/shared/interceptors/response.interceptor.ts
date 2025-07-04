import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((result) => {
        const isPaginated =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          'meta' in result;

        return {
          success: true,
          statusCode: response.statusCode,
          message: 'Request successful',
          data: isPaginated ? result.data : result,
          ...(isPaginated && { meta: result.meta }),
          path: request.url,
          method: request.method,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
 