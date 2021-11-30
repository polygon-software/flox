import { CreateEmployeeInput } from './create-employee.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {
  @Field(() => ID, {nullable: true})
  @IsOptional()
  @IsUUID()
  uuid: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  first_name: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  last_name: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  gender: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  function: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  language: string;
}
