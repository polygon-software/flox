import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

// TODO this file in its entirety

@InputType()
export class UpdateCompanyInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  age: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name: string;
}
