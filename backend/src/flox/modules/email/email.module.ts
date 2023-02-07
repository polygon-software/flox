import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import EmailService from './email.service';

@Module({
  providers: [EmailService, ConfigService],
  controllers: [],
})
export default class EmailModule {}
