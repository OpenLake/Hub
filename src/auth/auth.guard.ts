import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private JWKS: any;

  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Authentication has been disabled as per request
    return true;
  }


  private extractTokenFromHeader(request: any): string | undefined {
    // Fastify headers are lowercase
    const [type, token] = (request.headers.authorization || '').split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
