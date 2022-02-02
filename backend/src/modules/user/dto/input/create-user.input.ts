import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmptyObject,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import PrivateFile from '../../../file/entities/private_file.entity';

@InputType()
/**
 * Input for user creation
 */
export class CreateUserInput {
  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  uuid: string;

  @Field(() => String, { description: 'Username' })
  @IsString()
  username: string;

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
  birthdate: Date;

  @Field(() => [String], { description: 'User interest categories' })
  @IsArray()
  interests: string[];

  @Field(() => CreateAddressInput, { description: 'User address' })
  @IsNotEmptyObject()
  address: CreateAddressInput;
}
