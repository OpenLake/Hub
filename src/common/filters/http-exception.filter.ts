import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let error = {
      code: 'INTERNAL_ERROR',
      message: 'Unexpected error occurred',
    };

    if (typeof exceptionResponse === 'string') {
      error.message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      // NestJS standard exceptions
      error.message = (exceptionResponse as any).message || error.message;
      error.code = (exceptionResponse as any).error || 'ERROR';
      
      // Override standard NestJS errors like "Unauthorized" -> "UNAUTHORIZED"
      if (status === 401) error.code = 'UNAUTHORIZED';
      if (status === 403) error.code = 'FORBIDDEN';
      if (status === 404) error.code = 'NOT_FOUND';
    }

    if (status === 500) {
      this.logger.error(`Exception: ${exception}`, (exception as any).stack);
    }

    response.status(status).send({
      success: false,
      error: error,
    });
  }
}
