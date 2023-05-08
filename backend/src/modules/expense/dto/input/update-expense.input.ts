import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateExpenseInput from './create-expense.input';

@InputType()
export default class UpdateExpenseInput extends PartialType(
  CreateExpenseInput,
) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
