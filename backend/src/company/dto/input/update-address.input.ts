import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  @Field(() => String)
  @IsString()
  street: string;

  @Field(() => String)
  @IsString()
  number: string;

  @Field(() => String)
  @IsString()
  city: string;

  @Field(() => String)
  @IsString()
  zip_code: string;
}
