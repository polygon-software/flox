import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';

/**
 * Article entity
 */
@Entity()
@ObjectType()
export default class ArticleSuggestion extends BaseEntity {
  @Field(() => String, { description: 'Article number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  articleNumber: string;

  @Field(() => String, { description: 'Manufacturer number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  manufacturerNumber: string;

  @Field(() => String, { description: 'Name', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => String, { description: 'Description', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Number, { description: 'Amount', nullable: true })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  amount: number;

  @Field(() => Number, {
    description: 'Price',
    nullable: true,
  })
  @Column({ type: 'float8', nullable: true })
  @IsNumber()
  @IsOptional()
  price: number;
}
