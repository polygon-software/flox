import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { GetProductArgs } from './dto/args/get-product.args';
import { GetProductsArgs } from './dto/args/get-products.args';
import { DeleteProductInput } from './dto/input/delete-product.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PRODUCT_STATUS } from '../../ENUM/ENUM';
import { DuplicateProductInput } from './dto/input/duplicate-product.input';

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

  /**
   * Updates an existing product
   * @param {UpdateProductInput} updateProductInput
   */
  async update(updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.productsRepository.create(updateProductInput);
    await this.productsRepository.update(updateProductInput.uuid, product);
    return this.productsRepository.findOne(updateProductInput.uuid);
  }

  /**
   * Duplicates an existing product and returns the new Product
   * @param {string} uuid - the existing product's UUID
   */
  async duplicate(
    duplicateProductInput: DuplicateProductInput,
  ): Promise<Product> {
    const uuid = duplicateProductInput.uuid;
    const existingProduct = await this.productsRepository.findOne(uuid);
    if (!existingProduct) {
      throw new Error(`Product ${uuid} does not exist`);
    }

    // Set up params for new product creation
    const createProductInput = {
      title: existingProduct.title,
      description: existingProduct.description,
      brand: existingProduct.brand,
      category: existingProduct.category,
      value: existingProduct.value,
      currency: existingProduct.currency,
      start: existingProduct.start, //TODO does not make sense
      end: existingProduct.end, //TODO does not make sense
      // TODO: Pictures? how to handle...
      status: PRODUCT_STATUS.DRAFT,
      sponsored: existingProduct.sponsored,
      directBuyLink: existingProduct.directBuyLink,
      directBuyLinkMaxClicks: existingProduct.directBuyLinkMaxClicks,
      directBuyLinkMaxCost: existingProduct.directBuyLinkMaxCost,
      brandLink: existingProduct.brandLink,
      brandLinkMaxClicks: existingProduct.brandLinkMaxClicks,
      brandLinkMaxCost: existingProduct.brandLinkMaxCost,
      minBet: existingProduct.minBet,
      maxBet: existingProduct.maxBet,
      tags: existingProduct.tags,
    };

    const product = await this.productsRepository.create(createProductInput);
    return this.productsRepository.save(product);
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
