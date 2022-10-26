import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserQueryOutput } from './output/user-query.output';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserQueryOutput])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
