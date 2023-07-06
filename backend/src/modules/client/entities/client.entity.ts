import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import { LEGAL_FORM } from '../../../ENUM/enum';
import Address from '../../address/entities/address.entity';

/**
 * Client entity
 */
@Entity()
@ObjectType()
export default class Client extends BaseEntity {
  @Field(() => String, { description: "Client's first name", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: "Client's last name", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => String, {
    description: "Name of the client's company",
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  companyName: string;

  @Field(() => LEGAL_FORM, {
    description: "Legal form of the client's company",
    nullable: true,
  })
  @Column({ nullable: true, type: 'enum', enum: LEGAL_FORM })
  @IsEnum(LEGAL_FORM)
  @IsOptional()
  companyLegalForm: LEGAL_FORM;

  @Field(() => Address, { description: "Client's address", nullable: true })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, nullable: true })
  @IsObject()
  @IsOptional()
  address: Address;

  @Field(() => String, { description: "Client's phone number", nullable: true })
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
}
