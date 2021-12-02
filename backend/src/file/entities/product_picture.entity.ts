import { Entity, ManyToOne } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import PublicFile from './public_file.entity';
import { Product } from '../../product/entities/product.entity';

/**
 * Defines a public file within a public AWS S3 bucket
 */

@InputType('product_picture')
@Entity()
@ObjectType()
export class ProductPicture extends PublicFile {
  @Field(() => Product, { description: 'Product the picture belongs to' })
  @ManyToOne(() => Product, (product) => product.pictures)
  product: Product;
}

export default ProductPicture;
