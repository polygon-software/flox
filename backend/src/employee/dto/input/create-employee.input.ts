import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmptyObject,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Company } from '../../../company/entities/company.entity';

@InputType()
export class CreateEmployeeInput {
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

  @Field(() => Company, { description: 'Company' })
  @IsNotEmptyObject()
  company: Company;
}
