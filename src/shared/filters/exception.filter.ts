import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: any = {};

    // 🟢 Agar HttpException bo‘lsa
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      errorResponse = typeof response === 'string' ? { message: response } : response;
      message = errorResponse.message || message;
    }

    // 🔴 Agar PostgreSQL DatabaseError bo‘lsa
    else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception
    ) {
      const pgError = exception as any;

      switch (pgError.code) {
        case '23505': // unique_violation
          status = HttpStatus.CONFLICT;
          message = 'Duplicate entry: already exists.';
          break;
        case '23503': // foreign_key_violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid reference: related entity does not exist.';
          break;
        case '23502': // not_null_violation
          status = HttpStatus.BAD_REQUEST;
          message = `Missing required field: ${pgError.column}`;
          break;
        default:
          message = pgError.message || message;
      }
    }

    // 🔴 Logger
    this.logger.error(
      `🚨 [${req.method}] ${req.url} -> ${status} | ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 🔴 Response
    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
}
