import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from '../address/entities/address.entity';
import PrivateFile from '../file/entities/private_file.entity';
import PublicFile from '../file/entities/public_file.entity';
import { FileService } from '../file/file.service';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, PrivateFile, PublicFile, Product]),
  ],
  providers: [UserResolver, UserService, FileService],
})
export class UserModule {}
