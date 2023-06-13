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
  @Field(() => String, { description: 'Street', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  street: string;

  @Field(() => String, { description: 'Number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  number: string;

  @Field(() => String, { description: 'City', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  city: string;

  @Field(() => Number, { description: 'Zip Code', nullable: true })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  zipCode: number;

  @Field(() => String, {
    description: 'Additional address string',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  additionalAddress: string;
}
