import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserQueryOutput } from './output/user-query.output';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserQueryOutput])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
