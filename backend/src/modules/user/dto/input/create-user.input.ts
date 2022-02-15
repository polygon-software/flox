import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsNotEmptyObject,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';

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

  @Field(() => CreateAddressInput, { description: 'User address' })
  @IsNotEmptyObject()
  address: CreateAddressInput;
}
