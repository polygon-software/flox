import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../address/entities/address.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [DeviceResolver, DeviceService, UserService],
  exports: [DeviceService],
})
export class DeviceModule {}
