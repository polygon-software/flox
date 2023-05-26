import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsInt, IsOptional, IsString } from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';

/**
 * An entity representing a single address
 */
@Entity()
@ObjectType()
export default class Address extends BaseEntity {
  @Field(() => String, { description: 'Street' })
  @Column()
  @IsString()
  street: string;

  @Field(() => String, { description: 'Number' })
  @Column()
  @IsString()
  number: string;

  @Field(() => String, { description: 'City' })
  @Column()
  @IsString()
  city: string;

  @Field(() => Number, { description: 'Zip Code' })
  @Column()
  @IsInt()
  zipCode: number;

  @Field(() => String, {
    description: 'Additional address string',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  additionalAddress: string;
}
