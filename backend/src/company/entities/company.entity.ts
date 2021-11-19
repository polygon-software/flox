import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { Address } from '../../address/entities/address.entity';

@ObjectType()
@Entity({ name: 'company' })
export class Company extends BaseEntity {
  @Field(() => String, { description: 'Company Name' })
  @Column()
  @IsString()
  company_name: string;

  @Field(() => String, { description: 'Contact person Name' })
  @Column()
  @IsString()
  person_name: string;

  @Field(() => String, { description: 'Language' })
  @Column()
  @IsString()
  language: string;

  @Field(() => String, { description: 'Company UID' })
  @Column()
  @IsString()
  @IsOptional()
  uid: string;

  @Field(() => Address, { description: 'Domicile address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true })
  domicile_address: Address;

  @Field(() => Address, { description: 'Correspondence address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true })
  correspondence_address: Address;

  @Field(() => String, { description: 'Phone Number' })
  @Column()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { description: 'E-Mail address' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => Boolean, { description: 'Branch structure' })
  @Column()
  @IsBoolean()
  branch_structure: boolean;

  // TODO sub-users
  // @Field(() => [Item], { description: 'Items of the user', nullable: true })
  // @OneToMany(() => Item, (item) => item.user)
  // items: Item[];

  @Field(() => Boolean, {
    description:
      'Whether document upload is enabled (initial request granted by SOI)',
  })
  @Column()
  @IsBoolean()
  document_upload_enabled: boolean;
}
