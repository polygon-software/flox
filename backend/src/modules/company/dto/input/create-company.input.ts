import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { CreateAddressInput } from 'src/modules/address/dto/input/create-address.input';
import { CreatePersonInput } from '../../../person/dto/create-person.input';

@InputType()
export class CreateCompanyInput extends PartialType(CreatePersonInput) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  company_name: string;

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

  @Field(() => Boolean)
  @IsBoolean()
  branch_structure: boolean;
}
