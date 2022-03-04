import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule, UserModule],
  providers: [DeviceResolver, DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
