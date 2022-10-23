import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/authentication.decorator';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';

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
          this.configService.getOrThrow('database.database'),
        ),
    ]);
  }
}
