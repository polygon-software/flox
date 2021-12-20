import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { IsNotEmptyObject } from 'class-validator';

@InputType()
export class CreateUserlessBankInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;
}
