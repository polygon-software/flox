import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import Form from '../../form/entities/form.entity';

/**
 * Protocol entity
 */
@Entity()
@ObjectType()
export default class Protocol extends BaseEntity {
  @Field(() => Date, {
    description: 'Protocol date',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  date: Date;

  @Field(() => String, { description: 'Article number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  articleNumber: string;

  @Field(() => String, { description: 'Label of the protocol', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  label: string;

  @Field(() => String, {
    description: 'Description of the protocol',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => String, {
    description: 'Unit of the protocol',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  unit: string;

  @Field(() => String, {
    description: 'Amount of units in the protocol',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  amount: string;

  @Field(() => String, {
    description: 'Price of units in the protocol',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  price: string;

  @Field(() => String, {
    description: 'Unit discount',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  discount: string;

  @Field(() => String, {
    description: 'Sum of the total cost in the protocol',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  sum: string;

  @Field(() => Form, {
    description: 'Form this protocol belongs to',
    nullable: true,
  })
  @ManyToOne(() => Form, (form) => form.protocols, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @IsObject()
  form: Form;

  /**
   * Set articleNumber to 'p'
   */
  @BeforeInsert()
  @BeforeUpdate()
  setArticleNumberToP(): void {
    this.articleNumber = 'p';
  }
}
