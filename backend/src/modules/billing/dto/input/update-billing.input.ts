import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateBillingInput from './create-billing.input';

@InputType()
export default class UpdateBillingInput extends PartialType(
  CreateBillingInput,
) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
