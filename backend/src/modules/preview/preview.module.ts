import { Module } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { PreviewResolver } from './preview.resolver';

@Module({
  imports: [],
  providers: [PreviewResolver, PreviewService],
  exports: [PreviewService],
})
export class PreviewModule {}
