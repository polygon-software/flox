import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserlessBankInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;
}
