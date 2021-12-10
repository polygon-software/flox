import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { IsNotEmptyObject } from 'class-validator';

@InputType()
export class CreateBankInput extends PartialType(CreatePersonInput) {
  @Field(() => CreateAddressInput)
  @IsNotEmptyObject()
  address: CreateAddressInput;
}
