import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  age: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name: string;
}
