import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { GetProductArgs } from './dto/args/get-product.args';
import { DeleteProductInput } from './dto/input/delete-product.input';
import { Product } from './entities/product.entity';
import { GetProductsArgs } from './dto/args/get-products.args';
import { Public } from 'src/auth/authentication.decorator';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productsService: ProductService) {}

  @Public()
  @Query(() => [Product], { name: 'products' })
  async getProducts(
    @Args() getProductsArgs: GetProductsArgs,
  ): Promise<Product[]> {
    return await this.productsService.getProducts(getProductsArgs);
  }

  @Public()
  @Query(() => [Product], { name: 'allProducts' })
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.getAllProducts();
  }

  @Public()
  @Query(() => Product, { name: 'product' })
  async getProduct(@Args() getProductArgs: GetProductArgs): Promise<Product> {
    return await this.productsService.getProduct(getProductArgs);
  }

  @Public()
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return await this.productsService.create(createProductInput);
  }

  @Public()
  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return await this.productsService.update(updateProductInput);
  }

  @Public()
  @Mutation(() => Product)
  async removeProduct(
    @Args('deleteProductInput') deleteProductInput: DeleteProductInput,
  ): Promise<Product> {
    return await this.productsService.remove(deleteProductInput);
  }
}
