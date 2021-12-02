import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsDate, IsInt, IsString } from 'class-validator';
import PublicFile from '../../file/entities/public_file.entity';
import ProductPicture from '../../file/entities/product_picture.entity';

@ObjectType()
@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Description' })
  @Column()
  @IsString()
  description: string;

  @Field(() => Int, { description: 'Value' })
  @Column()
  @IsInt()
  value: number;

  @Field(() => Date, { description: 'Start date' })
  @Column()
  @IsDate()
  start: Date;

  @Field(() => Date, { description: 'End Date' })
  @Column()
  @IsDate()
  end: Date;

  @Field(() => [PublicFile], {
    description: 'Items of the user',
    nullable: true,
  })
  @OneToMany(() => ProductPicture, (picture) => picture.product)
  pictures: ProductPicture[];

  // TODO: Remaining fields from UML
}
