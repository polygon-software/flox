import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DeviceResolver, DeviceService, UserService],
  exports: [DeviceService],
})
export class DeviceModule {}
