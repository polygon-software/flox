import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { GetProductArgs } from './dto/args/get-product.args';
import { GetProductsArgs } from './dto/args/get-products.args';
import { DeleteProductInput } from './dto/input/delete-product.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const product = await this.productsRepository.create(createProductInput);
    return this.productsRepository.save(product);
  }

  getProducts(getProductsArgs: GetProductsArgs): Promise<Product[]> {
    if (getProductsArgs.uuids !== undefined) {
      return this.productsRepository.findByIds(getProductsArgs.uuids);
    } else {
      return this.productsRepository.find();
    }
  }

  getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  getProduct(getProductArgs: GetProductArgs): Promise<Product> {
    return this.productsRepository.findOne(getProductArgs.uuid);
  }

  async update(updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.productsRepository.create(updateProductInput);
    await this.productsRepository.update(updateProductInput.uuid, product);
    return this.productsRepository.findOne(updateProductInput.uuid);
  }

  async remove(deleteProductInput: DeleteProductInput): Promise<Product> {
    const product = await this.productsRepository.findOne(
      deleteProductInput.uuid,
    );
    const uuid = product.uuid;
    const deleted_product = await this.productsRepository.remove(product);
    deleted_product.uuid = uuid;
    return deleted_product;
  }
}
