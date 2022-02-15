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
import { FileService } from '../file/file.service';
import fetch from 'node-fetch';
import PublicFile from '../file/entities/public_file.entity';
import { base64ToBuffer } from '../../helpers/image-helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(PublicFile)
    private readonly fileRepository: Repository<PublicFile>,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    pictures: Array<string>,
  ): Promise<Product> {
    // Create the product
    const product = this.productsRepository.create(createProductInput);
    const savedProduct = await this.productsRepository.save(product);

    await this.createPublicFiles(pictures, savedProduct);
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
   * @param {UpdateProductInput} updateProductInput - update product input
   * @param {Array<string>|null} pictures - pictures
   * @returns {Promise<Product>} - updated product
   */
  async update(
    updateProductInput: UpdateProductInput,
    pictures: Array<string> | null,
  ): Promise<Product> {
    const currentProduct = await this.productsRepository.findOne(
      updateProductInput.uuid,
    );
    let updatedProduct;

    // Check if pictures have changed
    if (pictures !== null) {
      // Fetch existing product an delete all pictures
      for (const file of currentProduct.pictures) {
        await this.fileRepository.delete(file.uuid);
      }

      // Update the product
      const product = this.productsRepository.create(updateProductInput);
      await this.productsRepository.update(updateProductInput.uuid, product);
      updatedProduct = await this.productsRepository.findOne(
        updateProductInput.uuid,
      );
      await this.createPublicFiles(pictures, updatedProduct);
    } else {
      // Update the product
      const product = this.productsRepository.create(updateProductInput);
      await this.productsRepository.update(updateProductInput.uuid, product);
      updatedProduct = await this.productsRepository.findOne(
        updateProductInput.uuid,
      );
    }
    return updatedProduct;
  }

  /**
   * Duplicates an existing product and returns the new Product
   * @param {DuplicateProductInput} duplicateProductInput - The product input containing the existing product's data
   * @returns {Promise<Product>} - duplicated product
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
            console.error(error);
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
    const deletedProduct = await this.productsRepository.remove(product);
    deletedProduct.uuid = uuid;
    return deletedProduct;
  }

  /**
   * Converts an array of b64 strings to pictures, create PublicFile instances and links them to the corresponding Product.
   * @param {Array<string>} base64Strings The base64 strings to convert
   * @param {Product} product The product the pictures belong to
   * @private
   * @returns {Promise<void>} - creation end
   */
  private async createPublicFiles(
    base64Strings: Array<string>,
    product: Product,
  ): Promise<void> {
    // Create new picture objects
    for (const base64Picture of base64Strings) {
      // Remove prepended string
      let base64Picture2 = base64Picture;
      if (base64Picture.startsWith('stream;base64')) {
        base64Picture2 = base64Picture.replace('stream;base64,', '');
      }

      // Convert base64 to buffer
      const buffer = base64ToBuffer(base64Picture2);
      const index = base64Strings.indexOf(base64Picture2);

      // Upload the image
      await this.fileService.uploadPublicFile(
        buffer,
        `${product.title}_${index}.jpg`,
        product.uuid,
      );
    }
  }
}
