import { Module } from '@nestjs/common';
import { GlobiService } from './globi.service';
import { GlobiResolver } from './globi.resolver';

@Module({
  providers: [GlobiResolver, GlobiService]
})
export class GlobiModule {}
