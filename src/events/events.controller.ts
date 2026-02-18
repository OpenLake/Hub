import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { AuthGuard } from '../auth/auth.guard';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('events')
export class EventsController {
  constructor(private readonly proxy: ProxyService) {}
  
  private readonly SERVICE_URL = process.env.COSA_URL || 'http://localhost:3001';
  private readonly COSA_API = `${this.SERVICE_URL}/api/events`;

  @Get()
  async getAllEvents(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Hub: GET /api/v1/events -> CoSA: GET /api/events/events
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/events`,
      method: 'GET',
      headers: req.headers,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Get('latest')
  async getLatestEvents(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Hub: GET /api/v1/events/latest -> CoSA: GET /api/events/latest
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/latest`,
      method: 'GET',
      headers: req.headers,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Get(':id')
  async getEventById(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { id } = req.params as { id: string };
    // Hub: GET /api/v1/events/:id -> CoSA: GET /api/events/:id
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/${id}`,
      method: 'GET',
      headers: req.headers,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Post()
  async createEvent(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Hub: POST /api/v1/events -> CoSA: POST /api/events/create
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/create`,
      method: 'POST',
      headers: req.headers,
      data: req.body,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Post(':id/register')
  async registerEvent(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { id } = req.params as { id: string };
    // Hub: POST /api/v1/events/:id/register -> CoSA: POST /api/events/:id/register
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/${id}/register`,
      method: 'POST',
      headers: req.headers,
      data: req.body,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }
}
