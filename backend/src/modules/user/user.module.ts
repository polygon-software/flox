import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import Comment from '../comment/entities/comment.entity';
import { Address } from '../address/entities/address.entity';
import PrivateFile from '../file/entities/private_file.entity';
import PublicFile from '../file/entities/public_file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Comment, PrivateFile, PublicFile]),
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
