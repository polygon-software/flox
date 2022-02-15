import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import PublicFile from '../file/entities/public_file.entity';
import PrivateFile from '../file/entities/private_file.entity';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

describe('ProductResolver', () => {
  let productResolver: ProductResolver;
  let productService: ProductService;
  let productRepository: Repository<Product>;
  let publicFileRepository: Repository<PublicFile>;
  let privateFileRepository: Repository<PrivateFile>;
  let fileService: FileService;
  let configService: ConfigService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    publicFileRepository = new Repository<PublicFile>();
    privateFileRepository = new Repository<PrivateFile>();
    productRepository = new Repository<Product>();
    userRepository = new Repository<User>();

    configService = new ConfigService();
    fileService = new FileService(
      publicFileRepository,
      privateFileRepository,
      productRepository,
      userRepository,
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
