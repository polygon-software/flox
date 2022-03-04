import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  providers: [ProjectResolver, ProjectService, UserService],
  exports: [ProjectService],
})
export class ProjectModule {}
