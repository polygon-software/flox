import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';

@InputType()
export class CreateBankInput extends PartialType(CreatePersonInput) {
  @Field(() => CreateAddressInput)
  address: CreateAddressInput;

  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;
}
