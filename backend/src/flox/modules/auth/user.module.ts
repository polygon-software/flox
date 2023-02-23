import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserGroup from '../access-control/entities/user-group.entity';
import EmailService from '../email/email.service';

import User from './entities/user.entity';
import UserSearchOutput from './dto/output/user-search.output';
import UserResolver from './user.resolver';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSearchOutput, UserGroup])],
  providers: [UserResolver, UserService, EmailService],
  exports: [UserService],
})
export default class UserModule {}
