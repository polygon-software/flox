import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateAddressInput } from 'src/address/dto/input/create-address.input';

@InputType()
export class UpdateCompanyInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String)
  @IsString()
  company_name: string;

  @Field(() => String)
  @IsString()
  first_name: string;

  @Field(() => String)
  @IsString()
  last_name: string;

  @Field(() => String)
  @IsString()
  language: string;

  @Field(() => String, { nullable: true })
  @IsString()
  uid: string;

  @Field(() => CreateAddressInput)
  domicile_address: CreateAddressInput;

  @Field(() => CreateAddressInput)
  correspondence_address: CreateAddressInput;

  @Field(() => String)
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => Boolean)
  @IsBoolean()
  branch_structure: boolean;
}
