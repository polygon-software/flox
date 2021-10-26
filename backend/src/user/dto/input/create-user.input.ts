import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => Int)
  @IsInt()
  age: number;
}
