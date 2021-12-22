import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateBankInput extends PartialType(CreatePersonInput) {
  @Field(() => CreateAddressInput)
  address: CreateAddressInput;

  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;

  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String)
  password: string;
}
