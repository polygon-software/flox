import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  providers: [DeviceResolver, DeviceService, UserService],
  exports: [DeviceService],
})
export class DeviceModule {}
