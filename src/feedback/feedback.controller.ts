import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly proxy: ProxyService) {}

  private readonly SERVICE_URL = process.env.COSA_URL || 'http://localhost:3001';
  private readonly COSA_API = `${this.SERVICE_URL}/api/feedback`;

  @Get()
  async getAll(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Hub: GET /api/v1/feedback -> CoSA: GET /api/feedback/view-feedback
    try {
      const result = await this.proxy.forward({
        service: 'COSA',
        url: `${this.COSA_API}/view-feedback`,
        method: 'GET',
        headers: req.headers,
        params: { ...(req.query as any) },
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res.status(err.response.status).headers(err.response.headers).send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }

  @Post()
  async create(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Hub: POST /api/v1/feedback -> CoSA: POST /api/feedback/add
    try {
      const result = await this.proxy.forward({
        service: 'COSA',
        url: `${this.COSA_API}/add`,
        method: 'POST',
        headers: req.headers,
        data: req.body,
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res.status(err.response.status).headers(err.response.headers).send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }
}
