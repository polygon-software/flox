import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsArray, IsDate, IsInt, IsNumber, IsString, IsUrl } from 'class-validator';
import PublicFile from '../../file/entities/public_file.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../ENUM/ENUM';


@ObjectType()
@Entity({ name: 'product' })
@InputType('product')
export class Product extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Description', nullable: true })
  @Column({ nullable: true })
  @IsString()
  description: string;

  @Field(() => String, { description: 'Brand', nullable: true })
  @Column({ nullable: true })
  @IsString()
  brand: string;

  @Field(() => CATEGORY, { description: 'Product category', nullable: true })
  @Column({
    type: 'enum',
    enum: CATEGORY,
    nullable: true,
  })
  category: CATEGORY;

  @Field(() => Int, { description: 'Value', nullable: true })
  @Column({ nullable: true })
  @IsInt()
  value: number;

  @Field(() => CURRENCY, { description: 'The currency the value is denoted in', nullable: true })
  @Column({
    type: 'enum',
    enum: CURRENCY,
    default: CURRENCY.CHF,
    nullable: true,
  })
  currency: CURRENCY;

  @Field(() => Date, { description: 'Start date', nullable: true })
  @Column({ nullable: true })
  @IsDate()
  start: Date;

  @Field(() => Date, { description: 'End Date', nullable: true })
  @Column({ nullable: true })
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

  @Field(() => Boolean, { description: 'Whether the product is sponsored', nullable: true })
  @Column({ default: false, nullable: true })
  sponsored: boolean;

  @Field(() => String, { description: 'Direct Buy link', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsUrl()
  directBuyLink: string;

  @Field(() => Number, { description: 'Current number of clicks on direct buy link', nullable: true})
  @Column( { nullable: true, default: 0 })
  @IsNumber()
  directBuyLinkClicks: number;

  @Field(() => Number, { description: 'Maximum number of clicks on direct buy link', nullable: true})
  @Column( { nullable: true })
  @IsNumber()
  directBuyLinkMaxClicks: number;

  @Field(() => Number, { description: 'Current cost of direct buy link', nullable: true})
  @Column( { nullable: true, default: 0 })
  @IsNumber()
  directBuyLinkCost: number;

  @Field(() => Number, { description: 'Maximum cost of direct buy link', nullable: true})
  @Column( { nullable: true })
  @IsNumber()
  directBuyLinkMaxCost: number;

  @Field(() => String, { description: 'Brand link', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsUrl()
  brandLink: string;

  @Field(() => Number, { description: 'Current number of clicks on brand link', nullable: true})
  @Column( { nullable: true, default: 0 })
  @IsNumber()
  brandLinkClicks: number;

  @Field(() => Number, { description: 'Maximum number of clicks on brand link', nullable: true})
  @Column( { nullable: true })
  @IsNumber()
  brandLinkMaxClicks: number;

  @Field(() => Number, { description: 'Current cost of brand link', nullable: true})
  @Column( { nullable: true, default: 0 })
  @IsNumber()
  brandLinkCost: number;

  @Field(() => Number, { description: 'Maximum cost of brand link', nullable: true})
  @Column( { nullable: true })
  @IsNumber()
  brandLinkMaxCost: number;

  @Field(() => Number, { description: 'Minimum bet', nullable: true })
  @Column({ nullable: true })
  @IsInt()
  minBet: number;

  @Field(() => Number, { description: 'Maximum bet', nullable: true })
  @Column({ nullable: true })
  @IsInt()
  maxBet: number;

  @Field(() => [String], { description: 'Product tags', nullable: true })
  @Column( "text", { nullable: true, default: [], array: true })
  @IsArray()
  tags: string[];

  @Field(() => [Comment], { description: 'Comments' })
  @OneToMany(() => Comment, (comment) => comment.product, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  comments: Comment[];

  @Field(() => Number, { description: 'Number of Likes' })
  @Column({ nullable: true, default: 0 })
  @IsNumber()
  likes: number;

  // TODO: Clearify if we need Rrepeating sales
}
