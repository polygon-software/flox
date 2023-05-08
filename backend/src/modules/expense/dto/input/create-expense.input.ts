import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export default class CreateExpenseInput {
  @Field(() => String, { description: 'Expense name', nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => Number, {
    description: 'Amount of time needed for the job',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  timeAmount: number;

  @Field(() => Number, { description: 'Discount in percent', nullable: true })
  @IsNumber()
  @IsOptional()
  discount: number;
}
