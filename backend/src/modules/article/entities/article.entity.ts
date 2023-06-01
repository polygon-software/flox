import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import Form from '../../form/entities/form.entity';

/**
 * Article entity
 */
@Entity()
@ObjectType()
export default class Article extends BaseEntity {
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

  @Field(() => Number, { description: 'Amount', nullable: true })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  amount: number;

  @Field(() => Number, {
    description: 'Discount in percent',
    nullable: true,
  })
  @Column({ type: 'float8', nullable: true })
  @IsNumber()
  @IsOptional()
  discount: number;

  @Field(() => Form, {
    description: 'Form this arcticle belongs to',
    nullable: true,
  })
  @ManyToOne(() => Form, (form) => form.articles, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @IsObject()
  form: Form;
}
