import { Controller, Get, Query, Req, Res, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import type { FastifyReply } from 'fastify';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('bundle')
  async getUserBundle(
    @Query('email') email: string,
    @Res() res: FastifyReply,
  ) {
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
