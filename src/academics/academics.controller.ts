import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('academics')
export class AcademicsController {
  constructor(private readonly proxy: ProxyService) {}

  private readonly SERVICE_URL =
    process.env.ACADMAP_URL || 'https://acadmap.openlake.in';
  private readonly ACADMAP_API = `${this.SERVICE_URL}/api`;

  // Hub: GET /api/v1/academics/courses -> AcadMap: GET /api/courses
  @Get('courses')
  async getCourses(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      const result = await this.proxy.forward({
        service: 'ACADMAP',
        url: `${this.ACADMAP_API}/courses`,
        method: 'GET',
        headers: req.headers,
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res
          .status(err.response.status)
          .headers(err.response.headers)
          .send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }

  // Hub: GET /api/v1/academics/timetable -> AcadMap: GET /api/timetable
  @Get('timetable')
  async getTimetable(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      const result = await this.proxy.forward({
        service: 'ACADMAP',
        url: `${this.ACADMAP_API}/timetable`,
        method: 'GET',
        headers: req.headers,
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res
          .status(err.response.status)
          .headers(err.response.headers)
          .send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }

  // Hub: GET /api/v1/academics/curriculum -> AcadMap: GET /api/curriculum
  @Get('curriculum')
  async getCurriculum(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      const result = await this.proxy.forward({
        service: 'ACADMAP',
        url: `${this.ACADMAP_API}/curriculum`,
        method: 'GET',
        headers: req.headers,
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res
          .status(err.response.status)
          .headers(err.response.headers)
          .send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }

  // Hub: GET /api/v1/academics/curriculum/:branch -> AcadMap: GET /api/curriculum/:branch
  @Get('curriculum/:branch')
  async getBranchCurriculum(
    @Param('branch') branch: string,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    try {
      const result = await this.proxy.forward({
        service: 'ACADMAP',
        url: `${this.ACADMAP_API}/curriculum/${branch}`,
        method: 'GET',
        headers: req.headers,
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res
          .status(err.response.status)
          .headers(err.response.headers)
          .send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }

  // Hub: GET /api/v1/academics/departments -> AcadMap: GET /api/departments
  @Get('departments')
  async getDepartments(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      const result = await this.proxy.forward({
        service: 'ACADMAP',
        url: `${this.ACADMAP_API}/departments`,
        method: 'GET',
        headers: req.headers,
      });
      res.status(result.status).headers(result.headers).send(result.data);
    } catch (err) {
      if (err.response) {
        res
          .status(err.response.status)
          .headers(err.response.headers)
          .send(err.response.data);
      } else {
        res.status(502).send({ message: 'Bad Gateway', error: err.message });
      }
    }
  }
}
