import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import Form from '../../form/entities/form.entity';

/**
 * Expense entity
 */
@Entity()
@ObjectType()
export default class Expense extends BaseEntity {
  @Field(() => String, { description: 'Expense name', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => Number, {
    description: 'Amount of time needed for the job',
    nullable: true,
  })
  @Column({ type: 'float8', nullable: true })
  @IsNumber()
  @IsOptional()
  timeAmount: number;

  @Field(() => Number, { description: 'Discount in percent', nullable: true })
  @Column({ type: 'float8', nullable: true })
  @IsNumber()
  @IsOptional()
  discount: number;

  @Field(() => Form, {
    description: 'Form the expense belongs to',
    nullable: true,
  })
  @ManyToOne(() => Form, (form) => form.expenses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @IsObject()
  form: Form;
}
