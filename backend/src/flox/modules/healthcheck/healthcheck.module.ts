import { Module } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';
import { HealthcheckController } from './healthcheck.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [HealthcheckService, ConfigService],
  controllers: [HealthcheckController],
})
export class HealthcheckModule {}
