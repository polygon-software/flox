import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import Address from '../../address/entities/address.entity';

/**
 * Tenant entity
 */
@Entity()
@ObjectType()
export default class Tenant extends BaseEntity {
  @Field(() => String, { description: "Tenant's first name", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: "Tenant's last name", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => Address, { description: "Tenant's address", nullable: true })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, nullable: true })
  @IsObject()
  @IsOptional()
  address: Address;

  @Field(() => String, { description: "Tenant's phone number", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @Field(() => String, {
    description: "Client's e-mail address",
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  email: string;

  @Field(() => String, {
    description: "Floor of tenant's apartment",
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  floor: string;
}
