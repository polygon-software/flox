import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserGroup from '../access-control/entities/user-group.entity';

import User from './entities/user.entity';
import UserSearchOutput from './output/user-search.output';
import UserResolver from './user.resolver';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSearchOutput, UserGroup])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
