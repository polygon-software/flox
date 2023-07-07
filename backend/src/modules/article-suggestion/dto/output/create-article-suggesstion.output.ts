import { Field, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ObjectType()
export default class CreateArticleSuggesstionOutput {
  @Field(() => Number, { description: 'Amount' })
  @IsInt()
  amount: number;
}
