import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Address } from '../../entities/address.entity';
import { CreateAddressInput } from './create-address.input';

// TODO
@InputType()
export class CreateCompanyInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  person_name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  language: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  uid: string;

  @Field(() => CreateAddressInput)
  @IsNotEmptyObject()
  domicile_address: CreateAddressInput;

  @Field(() => CreateAddressInput)
  @IsNotEmptyObject()
  correspondence_address: CreateAddressInput;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => Boolean)
  @IsBoolean()
  branch_structure: boolean;
}
