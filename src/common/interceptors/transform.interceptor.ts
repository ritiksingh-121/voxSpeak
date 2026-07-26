import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        const meta: Record<string, any> = {};
        if (data && typeof data === 'object') {
          if ('meta' in data) {
            Object.assign(meta, data.meta);
            delete data.meta;
          }
          if ('data' in data) {
            return { success: true, data: data.data, meta: { ...meta, ...data.meta } };
          }
        }
        return { success: true, data, meta: Object.keys(meta).length > 0 ? meta : undefined };
      }),
    );
  }
}
