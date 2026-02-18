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
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      // Dynamic import for ESM compatibility in Vercel/CommonJS environment
      const jose = await import('jose');
      
      if (!this.JWKS) {
        const authUrl = process.env.AUTH_SERVICE_URL || 'https://auth.openlake.in';
        this.JWKS = jose.createRemoteJWKSet(new URL(`${authUrl}/.well-known/jwks.json`));
      }

      const { payload } = await jose.jwtVerify(token, this.JWKS, {
        issuer: process.env.AUTH_ISSUER || 'openlake-auth',
      });

      // Attach user to request
      request['user'] = payload;

      // Inject headers for downstream
      request.headers['x-openlake-user-id'] = payload.sub as string;
      request.headers['x-openlake-role'] = payload.role as string;
      request.headers['x-openlake-scopes'] = Array.isArray(payload.scope) 
        ? payload.scope.join(' ') 
        : (payload.scope as string || '');
      
      // Request ID (Fastify usually has req.id, but let's ensure we propogate it or generate one)
      request.headers['x-openlake-request-id'] = (request as any).id || crypto.randomUUID();

      return true;
    } catch (e) {
      this.logger.error(`Token verification failed: ${e.message}`);
      throw new UnauthorizedException();
    }
  }


  private extractTokenFromHeader(request: any): string | undefined {
    // Fastify headers are lowercase
    const [type, token] = (request.headers.authorization || '').split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
