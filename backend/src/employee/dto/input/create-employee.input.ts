import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmptyObject, IsOptional,
  IsPhoneNumber,
  IsString, IsUUID,
} from 'class-validator';
import { Company } from 'src/company/entities/company.entity';
import { CreatePersonInput } from 'src/person/dto/create-person.input';

@InputType()
export class CreateEmployeeInput extends PartialType(CreatePersonInput) {
  @Field(() => String, { description: 'Language' })
  @IsString()
  language: string;

  @Field(() => String, { description: 'Function within the company' })
  @IsString()
  function: string;

  @Field(() => String, { description: 'E-mail' })
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { description: 'Gender' })
  @IsString()
  gender: string;

  @Field(() => Company, { nullable: true, description: 'Company' })
  @IsNotEmptyObject()
  company: Company;

  @Field(() => String, { description: 'Cognito ID' })
  @IsUUID()
  cognito_id: string;
}
