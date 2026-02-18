import { Controller, Get, Req, Res } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('home')
export class HomeController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  async getDashboard(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Define service URLs
    const cosaUrl = process.env.COSA_URL || 'http://localhost:3001';
    const marketUrl = process.env.MARKETPLACE_URL || 'http://localhost:3002';
    const jobsUrl = process.env.JOBS_URL || 'http://localhost:3004';
    const acadUrl = process.env.ACADEMICS_URL || 'http://localhost:3003';

    // Headers to forward
    const headers = req.headers;

    // Parallel requests
    const results = await Promise.allSettled([
      this.proxy.forward({
        service: 'COSA',
        url: `${cosaUrl}/events`, // Assuming endpoint exists
        method: 'GET',
        headers,
      }),
      this.proxy.forward({
        service: 'MARKETPLACE',
        url: `${marketUrl}/listings`, // Assuming endpoint exists
        method: 'GET',
        headers,
      }),
      this.proxy.forward({
        service: 'JOBS',
        url: `${jobsUrl}/jobs`, // Assuming endpoint exists
        method: 'GET',
        headers,
      }),
      this.proxy.forward({
        service: 'ACADEMICS',
        url: `${acadUrl}/announcements`, // Assuming endpoint exists
        method: 'GET',
        headers,
      }),
    ]);

    // Extract data
    const [events, marketplace, jobs, academics] = results;

    const data = {
      events: events.status === 'fulfilled' ? events.value.data : [],
      marketplace: marketplace.status === 'fulfilled' ? marketplace.value.data : [],
      jobs: jobs.status === 'fulfilled' ? jobs.value.data : [],
      // announcements: academics.status === 'fulfilled' ? academics.value.data : [], // Spec didn't explicitly mention announcements in data sample, but safe to keep or remove based on strictness. Let's keep it but maybe under a different key if needed? Spec said "events, marketplace, jobs". I'll keep it for now as it adds value.
    };

    const warnings: string[] = [];
    if (events.status === 'rejected') warnings.push('EVENT_SERVICE_UNAVAILABLE');
    if (marketplace.status === 'rejected') warnings.push('MARKETPLACE_SERVICE_UNAVAILABLE');
    if (jobs.status === 'rejected') warnings.push('JOBS_SERVICE_UNAVAILABLE');
    if (academics.status === 'rejected') warnings.push('ACADEMICS_SERVICE_UNAVAILABLE');

    // Return full response structure to bypass default interceptor wrapping
    return {
      success: true,
      data,
      meta: {
        warnings,
      },
    };
  }
}

