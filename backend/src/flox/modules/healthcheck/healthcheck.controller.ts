import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from '../auth/authentication.decorator';

@Controller('healthcheck')
export default class HealthcheckController {
  constructor(
    private readonly configService: ConfigService,
    private readonly healthcheckService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  /**
   *  Checks the application's status (database, connectivity etc.)
   */
  @Public()
  @HealthCheck()
  @SkipThrottle()
  @Get()
  async checkHealth(): Promise<HealthCheckResult> {
    return this.healthcheckService.check([
      // TODO application specific: add more health checks
      // See: https://progressivecoder.com/nestjs-health-check-terminus/
      // () =>
      // this.http.pingCheck(
      //   'Basic Check',
      //   `http://localhost:${this.configService.getOrThrow('server.port')}`,
      // ),

      // Database connectivity
      (): ReturnType<typeof this.database.pingCheck> =>
        this.database.pingCheck(
          this.configService.getOrThrow<string>('database.database'),
        ),
    ]);
  }
}
