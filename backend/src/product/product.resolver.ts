import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { GetProductArgs } from './dto/args/get-product.args';
import { DeleteProductInput } from './dto/input/delete-product.input';
import { Product } from './entities/product.entity';
import { GetProductsArgs } from './dto/args/get-products.args';
import { PubSub } from 'graphql-subscriptions';
import { Public } from '../auth/auth.guard';

// Publish/subscribe handler TODO make global and inject/provide, according to https://docs.nestjs.com/graphql/subscriptions
const pubSub = new PubSub();

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
  async create(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    const newProduct = await this.productsService.create(createProductInput);
    // Publish authentication so subscriptions will auto-update
    await pubSub.publish('productAdded', { productAdded: newProduct });
    return newProduct;
  }

  @Public()
  @Mutation(() => Product)
  async update(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return await this.productsService.update(updateProductInput);
  }

  @Public()
  @Mutation(() => Product)
  async remove(
    @Args('deleteProductInput') deleteProductInput: DeleteProductInput,
  ): Promise<Product> {
    return await this.productsService.remove(deleteProductInput);
  }

  @Public()
  @Subscription(() => Product)
  productAdded(): AsyncIterator<unknown, any, undefined> {
    return pubSub.asyncIterator('productAdded');
  }
}
