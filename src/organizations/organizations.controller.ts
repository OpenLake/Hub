import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly proxy: ProxyService) {}

  private readonly SERVICE_URL = process.env.COSA_URL || 'http://localhost:3001';
  private readonly COSA_API = `${this.SERVICE_URL}/api/orgUnit`;

  @Get()
  async getAll(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Hub: GET /api/v1/organizations -> CoSA: GET /api/orgUnit/organizational-units
    try {
      const result = await this.proxy.forward({
        service: 'COSA',
        url: `${this.COSA_API}/organizational-units`,
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

  @Get('by-email/:email')
  async getByEmail(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { email } = req.params as { email: string };
    // Hub: GET /api/v1/organizations/by-email/:email -> CoSA: GET /api/orgUnit/clubData/:email
    try {
      const result = await this.proxy.forward({
        service: 'COSA',
        url: `${this.COSA_API}/clubData/${email}`,
        method: 'GET',
        headers: req.headers,
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
    // Hub: POST /api/v1/organizations -> CoSA: POST /api/orgUnit/create
    try {
      const result = await this.proxy.forward({
        service: 'COSA',
        url: `${this.COSA_API}/create`,
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
