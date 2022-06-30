import { Controller, Get, Req, Res } from '@nestjs/common';
import fastify = require('fastify');
import { Public } from '../auth/authentication.decorator';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthcheckController {
  constructor(
    private readonly healthcheckService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Public()
  @HealthCheck()
  @Get()
  async checkHealth(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    return this.healthcheckService.check([
      () => this.http.pingCheck('Basic Check', 'http://localhost:3000'),
    ]);
  }
}
