import { Controller, Get, Req, Res } from '@nestjs/common';
import fastify = require('fastify');
import { Public } from '../auth/authentication.decorator';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('healthcheck')
export class HealthcheckController {
  constructor(
    private readonly configService: ConfigService,
    private readonly healthcheckService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @HealthCheck()
  @Get()
  async checkHealth(): Promise<any> {
    return this.healthcheckService.check([
      // TODO application specific: add more health checks
      // See: https://progressivecoder.com/nestjs-health-check-terminus/
      // () =>
      // this.http.pingCheck(
      //   'Basic Check',
      //   `http://localhost:${this.configService.get('server.port')}`,
      // ),

      // Database connectivity
      () =>
        this.database.pingCheck(this.configService.get('database.database')),
    ]);
  }
}
