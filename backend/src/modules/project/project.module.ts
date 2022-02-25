import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../address/entities/address.entity';
import { User } from '../user/entities/user.entity';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [ProjectResolver, ProjectService, UserService],
  exports: [ProjectService],
})
export class ProjectModule {}
