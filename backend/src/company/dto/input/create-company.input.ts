import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Address } from '../../../address/entities/address.entity';

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

  @Field(() => Address)
  @IsNotEmptyObject()
  domicile_address: Address;

  @Field(() => Address)
  @IsNotEmptyObject()
  correspondence_address: Address;

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
