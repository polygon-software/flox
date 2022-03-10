import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Address } from '../address/entities/address.entity';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Project])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
