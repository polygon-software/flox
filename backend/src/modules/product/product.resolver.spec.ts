import { Test, TestingModule } from '@nestjs/testing';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import PublicFile from '../file/entities/public_file.entity';
import PrivateFile from '../file/entities/private_file.entity';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';

describe('ProductResolver', () => {
  let productResolver: ProductResolver;
  let productService: ProductService;
  let productRepository: Repository<Product>;
  let publicFileRepository: Repository<PublicFile>;
  let privateFileRepository: Repository<PrivateFile>;
  let fileService: FileService;
  let configService: ConfigService;

  beforeEach(async () => {
    publicFileRepository = new Repository<PublicFile>();
    privateFileRepository = new Repository<PrivateFile>();
    productRepository = new Repository<Product>();

    configService = new ConfigService();
    fileService = new FileService(
      publicFileRepository,
      privateFileRepository,
      productRepository,
      configService,
    );
    productService = new ProductService(
      productRepository,
      publicFileRepository,
      fileService,
    );

    productResolver = new ProductResolver(productService);
  });

  it('should be defined', () => {
    expect(productResolver).toBeDefined();
  });
});
