import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ROLE } from '../../../../ENUM/ENUM';
import { Column } from 'typeorm';

@InputType()
/**
 * Input for user creation
 */
export class CreateUserInput {
  @Field(() => ROLE, { description: 'Role of the User' })
  @IsString()
  role: ROLE;

  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  uuid: string;

  @Field(() => String, { description: 'Full name of the user' })
  @IsString()
  fullName: string;

  @Field(() => String, { description: 'E-mail address' })
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'phone number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Date, { description: 'Date of birth' })
  @IsString()
  @IsDate()
  birthDate: Date;

  @Field(() => [String], { description: 'User interest categories' })
  @IsArray()
  interests: string[];
}
