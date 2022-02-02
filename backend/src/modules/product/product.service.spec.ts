import { ProductService } from './product.service';
import { FileService } from '../file/file.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import PrivateFile from '../file/entities/private_file.entity';
import PublicFile from '../file/entities/public_file.entity';
import { ConfigService } from '@nestjs/config';

describe('ProductService', () => {
  let productService: ProductService;
  let fileService: FileService;
  let productRepository: Repository<Product>;
  let publicFileRepository: Repository<PublicFile>;
  let privateFileRepository: Repository<PrivateFile>;
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
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });
});
