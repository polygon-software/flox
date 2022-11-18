import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import EmailController from './email.controller';
import EmailService from './email.service';

@Module({
  providers: [EmailService, ConfigService],
  controllers: [EmailController],
})
export default class EmailModule {}
