import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import Address from '../../address/entities/address.entity';

/**
 * Billing entity
 */
@Entity()
@ObjectType()
export default class Billing extends BaseEntity {
  @Field(() => String, { description: 'Billing company name', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  companyName: string;

  @Field(() => String, { description: 'First name on bill', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: 'Last name on bill', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => Address, { description: 'Billing address', nullable: true })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, nullable: true })
  @IsObject()
  @IsOptional()
  address: Address;

  @Field(() => String, {
    description: 'Billing e-mail address',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;
}
