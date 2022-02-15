import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { GetProductArgs } from './dto/args/get-product.args';
import { DeleteProductInput } from './dto/input/delete-product.input';
import { Product } from './entities/product.entity';
import { GetProductsArgs } from './dto/args/get-products.args';
import { Public } from '../../auth/authentication.decorator';
import { DuplicateProductInput } from './dto/input/duplicate-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productsService: ProductService) {}

  @Public()
  @Query(() => [Product], { name: 'products' })
  async getProducts(
    @Args() getProductsArgs: GetProductsArgs,
  ): Promise<Product[]> {
    return this.productsService.getProducts(getProductsArgs);
  }

  @Public()
  @Query(() => [Product], { name: 'allProducts' })
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Public()
  @Query(() => Product, { name: 'product' })
  async getProduct(@Args() getProductArgs: GetProductArgs): Promise<Product> {
    return this.productsService.getProduct(getProductArgs);
  }

  @Public()
  @Mutation(() => Product)
  async createProduct(
    @Args({ name: 'createProductInput', type: () => CreateProductInput })
    createProductInput: CreateProductInput,
    @Args({ name: 'pictures', type: () => [String] }) pictures: Array<string>,
  ): Promise<Product> {
    return this.productsService.create(createProductInput, pictures);
  }

  @Public()
  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @Args({
      name: 'pictures',
      type: () => [String],
      nullable: true,
      defaultValue: null,
    })
    pictures: Array<string> | null,
  ): Promise<Product> {
    return this.productsService.update(updateProductInput, pictures);
  }

  @Public()
  @Mutation(() => Product)
  async duplicateProduct(
    @Args('duplicateProductInput') duplicateProductInput: DuplicateProductInput,
  ): Promise<Product> {
    return this.productsService.duplicate(duplicateProductInput);
  }

  @Public()
  @Mutation(() => Product)
  async removeProduct(
    @Args('deleteProductInput') deleteProductInput: DeleteProductInput,
  ): Promise<Product> {
    return this.productsService.remove(deleteProductInput);
  }
}
