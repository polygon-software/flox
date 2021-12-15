import { Injectable, Logger } from '@nestjs/common';
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
import { FileService } from '../file/file.service';
import fetch from 'node-fetch';
import PublicFile from '../file/entities/public_file.entity';
import { base64ToBuffer } from '../../helpers/image-helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(PublicFile)
    private fileRepository: Repository<PublicFile>,
    private fileService: FileService,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    pictures: Array<string>,
  ): Promise<Product> {
    // Create the product
    const product = this.productsRepository.create(createProductInput);
    const savedProduct = await this.productsRepository.save(product);

    // Create image objects
    for (const base64Picture of pictures) {
      // Convert base64 to buffer
      const buffer = base64ToBuffer(base64Picture);
      const index = pictures.indexOf(base64Picture);

      // Upload the image
      await this.fileService.uploadPublicFile(
        buffer,
        `${savedProduct.title}_${index}.jpg`,
        savedProduct.uuid,
      );
    }
    return savedProduct;
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
   * @param {DuplicateProductInput} duplicateProductInput - The product input containing the existing product's data
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
      start: null, // Set no start/end date, making new copy a draft by default
      end: null,
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

    const product = this.productsRepository.create(createProductInput);
    const savedProduct = await this.productsRepository.save(product);

    // Create copy of each picture
    for (const picture of existingProduct.pictures) {
      // Create filename
      const fileName = picture.key.slice(37, picture.key.length);

      await fetch(picture.url).then((res) => {
        res
          .blob()
          .then(async (blob) => {
            // Convert blob to buffer
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload new file
            await this.fileService.uploadPublicFile(
              buffer,
              fileName,
              savedProduct.uuid,
            );
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }

    return savedProduct;
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
