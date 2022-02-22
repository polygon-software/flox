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
 * User registration Input
 */
export class RegisterUserInput {
  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  cognitoUuid: string;

  @Field(() => String, { description: 'Username' })
  @IsString()
  username: string;

  @Field(() => String, { description: 'Full name of the user', nullable: true })
  @IsString()
  fullName: string;

  @Field(() => String, { description: 'E-mail address' })
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'phone number', nullable: true })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Date, { description: 'Date of birth', nullable: true })
  @IsString()
  @IsDate()
  birthdate: Date;

  @Field(() => CreateAddressInput, {
    description: 'User address',
    nullable: true,
  })
  @IsNotEmptyObject()
  address: CreateAddressInput;
}
