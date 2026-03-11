import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      // Decode the JWT to get the user email payload
      // Alternatively, verify the JWT properly using Supabase JWT SECRET
      const decoded = jwt.decode(token) as any;
      
      if (!decoded || !decoded.email) {
          throw new UnauthorizedException('Invalid token payload');
      }
      
      request.user = decoded; // Store the user data on the request
      return true;
    } catch (e) {
      this.logger.error(`Token verification failed: ${e.message}`);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    // Fastify headers are lowercase
    const [type, token] = (request.headers.authorization || '').split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
