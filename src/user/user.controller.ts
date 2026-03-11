import { Controller, Get, Req, Res, BadRequestException, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
