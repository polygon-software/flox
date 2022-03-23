import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [
    UserModule,
    DeviceModule,
    TypeOrmModule.forFeature([Project, User]),
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
