import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './entities/user.entity';
import UserSearchOutput from './output/user-search.output';
import UserResolver from './user.resolver';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSearchOutput])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
