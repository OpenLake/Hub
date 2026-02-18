import { Controller, All, Req, Res } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly proxy: ProxyService) {}

  @All('*')
  async proxyMarketplace(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const serviceUrl = process.env.MARKETPLACE_URL || 'http://localhost:3002';
    const backendPath = req.url.replace('/api/v1', '');

    try {
      const result = await this.proxy.forward({
        service: 'MARKETPLACE',
        url: `${serviceUrl}${backendPath}`,
        method: req.method as any,
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
