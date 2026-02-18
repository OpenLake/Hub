import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already in expected format (e.g. from upstream proxy that follows spec),
        // we might want to avoid double wrapping.
        // But for v1, we assume Hub enforces the wrapper.
        // We'll check if it looks like the wrapper to be safe, or just wrap blindly if we control all outputs.
        
        // For /home aggregation, we return { events: [], ... } which is "data".
        // So we wrap it.
        
        // Handling "meta" is tricky if it's mixed with data.
        // We can define a convention: if controller returns { data: ..., meta: ... }, use it.
        // Otherwise, wrap everything as data.
        
        if (data && data.data && data.meta && data.success !== undefined) {
             return data;
        }

        return {
          success: true,
          data: data,
          meta: {}, // Optional: Add timestamp or request ID here
        };
      }),
    );
  }
}
