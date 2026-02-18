import { Controller, Get, Post, Put, Delete, Req, Res } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly proxy: ProxyService) {}

  private readonly SERVICE_URL = process.env.COSA_URL || 'http://localhost:3001';
  private readonly COSA_API = `${this.SERVICE_URL}/api/announcements`;

  @Get()
  async getAll(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const result = await this.proxy.forward({
      service: 'COSA',
      url: this.COSA_API,
      method: 'GET',
      headers: req.headers,
      params: req.query,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Get(':id')
  async getOne(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/${id}`,
      method: 'GET',
      headers: req.headers,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Post()
  async create(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const result = await this.proxy.forward({
      service: 'COSA',
      url: this.COSA_API,
      method: 'POST',
      headers: req.headers,
      data: req.body,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Put(':id')
  async update(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/${id}`,
      method: 'PUT',
      headers: req.headers,
      data: req.body,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }

  @Delete(':id')
  async delete(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await this.proxy.forward({
      service: 'COSA',
      url: `${this.COSA_API}/${id}`,
      method: 'DELETE',
      headers: req.headers,
    });
    res.status(result.status).headers(result.headers).send(result.data);
  }
}
