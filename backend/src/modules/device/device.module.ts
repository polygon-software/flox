import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, UserModule, ConfigModule],
  providers: [DeviceResolver, DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
