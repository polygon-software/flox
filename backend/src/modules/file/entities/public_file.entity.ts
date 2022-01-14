import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';
import { Product } from '../../product/entities/product.entity';

/**
 * Defines a public file within a public AWS S3 bucket
 */

@Entity()
@ObjectType()
export class PublicFile extends BaseEntity {
  @Field(() => String, { description: 'Public download URL' })
  @Column()
  @IsUrl()
  public url: string;

  @Field(() => String, { description: 'S3 File Key' })
  @Column()
  @IsString()
  public key: string;

  @Field(() => Product, {
    description: 'Product the file belongs to',
    nullable: true,
  })
  @ManyToOne(() => Product, (owner) => owner.pictures)
  product: Product;
}

export default PublicFile;
