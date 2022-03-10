import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { Project } from '../project/entities/project.entity';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    HttpModule,
    UserModule,
    ConfigModule,
    TypeOrmModule.forFeature([Project, User]),
  ],
  providers: [DeviceResolver, DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
