import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsDate, IsInt, IsString, IsUrl } from 'class-validator';
import PublicFile from '../../file/entities/public_file.entity';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../ENUM/ENUM';

@ObjectType()
@Entity({ name: 'product' })
@InputType('product')
export class Product extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Description' })
  @Column()
  @IsString()
  description: string;

  @Field(() => String, { description: 'Brand' })
  @Column()
  @IsString()
  brand: string;

  @Field(() => Int, { description: 'Value' })
  @Column()
  @IsInt()
  value: number;

  @Field(() => CURRENCY, {
    description: 'The currency the value is denoted in',
  })
  @Column({
    type: 'enum',
    enum: CURRENCY,
    default: CURRENCY.CHF,
  })
  currency: CURRENCY;

  @Field(() => Date, { description: 'Start date' })
  @Column()
  @IsDate()
  start: Date;

  @Field(() => Date, { description: 'End Date' })
  @Column()
  @IsDate()
  end: Date;

  @Field(() => [PublicFile], {
    description: 'Pictures for the product',
    nullable: true,
  })
  @OneToMany(() => PublicFile, (picture) => picture.product, {
    cascade: true,
    eager: true,
  })
  pictures: PublicFile[];

  @Field(() => PRODUCT_STATUS, { description: 'Status of the product' })
  @Column({
    type: 'enum',
    enum: PRODUCT_STATUS,
    default: PRODUCT_STATUS.DRAFT,
  })
  status: PRODUCT_STATUS;

  @Field(() => CATEGORY, { description: 'Product category' })
  @Column({
    type: 'enum',
    enum: CATEGORY,
  })
  category: CATEGORY;

  @Field(() => Boolean, { description: 'Whether the product is sponsored' })
  @Column({ default: false })
  sponsored: boolean;

  @Field(() => String, { description: 'Direct Buy link' })
  @Column({ nullable: true })
  @IsString()
  @IsUrl()
  directBuyLink: string;

  @Field(() => String, { description: 'Brand link' })
  @Column({ nullable: true })
  @IsString()
  @IsUrl()
  brandLink: string;

  @Field(() => Number, { description: 'Minimum bet' })
  @Column()
  @IsInt()
  minBet: number;

  @Field(() => Number, { description: 'Maximum bet' })
  @Column()
  @IsInt()
  maxBet: number;

  // TODO: Remaining fields from UML (tags, repeating sales, comments, likes)
}
