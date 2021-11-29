import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  company_name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  first_name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  last_name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  language: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  uid: string;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  domicile_address: CreateAddressInput;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  correspondence_address: CreateAddressInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  branch_structure: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  cognito_id: string;
}
