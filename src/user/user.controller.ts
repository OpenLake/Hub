import { Controller, Get, Req, Res, BadRequestException, UseGuards, UnauthorizedException, Query, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { SupabaseAuthGuard } from '../auth/supabase.guard';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('bundle')
  @UseGuards(SupabaseAuthGuard)
  async getUserBundle(
    @Req() req: FastifyRequest & { user: any },
    @Res() res: FastifyReply,
  ) {
    const email = req.user?.email;

    if (!email) {
      throw new UnauthorizedException('No email found in token payload');
    }

    const bundle = await this.userService.getUserBundle(email);
    res.send({
      status: 'success',
      data: bundle,
    });
  }

  /**
   * Internal Aggregation Testing Endpoint
   * Bypasses Auth Guard using X-Hub-Secret to test bundle logic
   */
  @Get('aggregate')
  async internalAggregate(
    @Query('email') email: string,
    @Headers('X-Hub-Secret') hubSecret: string,
    @Res() res: FastifyReply,
  ) {
    const internalSecret = this.configService.get<string>('HUB_INTERNAL_SECRET');

    if (!hubSecret || hubSecret !== internalSecret) {
      throw new UnauthorizedException('Invalid or missing X-Hub-Secret');
    }

    if (!email) {
      throw new BadRequestException('Email query parameter is required');
    }

    const bundle = await this.userService.getUserBundle(email);
    res.send({
      status: 'success',
      data: bundle,
    });
  }
}

