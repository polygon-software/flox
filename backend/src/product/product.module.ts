import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
