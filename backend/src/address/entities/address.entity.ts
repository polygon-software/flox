import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Company } from '../../company/entities/company.entity';

/**
 * An entity representing a single address
 */

@ObjectType()
@Entity({ name: 'address' })
export class Address extends BaseEntity {
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

  @Field(() => String, { description: 'Zip Code' })
  @Column()
  @IsString()
  zip_code: string;
}
