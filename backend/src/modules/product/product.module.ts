import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Comment } from '../comment/entities/comment.entity';
import PublicFile from '../file/entities/public_file.entity';
import { FileService } from '../file/file.service';
import PrivateFile from '../file/entities/private_file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Comment, PublicFile, PrivateFile]),
  ],
  providers: [ProductResolver, ProductService, FileService],
})
export class ProductModule {}
