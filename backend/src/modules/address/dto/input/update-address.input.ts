import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateAddressInput from './create-address.input';

@InputType()
export default class UpdateAddressInput extends PartialType(
  CreateAddressInput,
) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
