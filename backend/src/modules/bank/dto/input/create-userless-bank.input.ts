import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createUserlessBankInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;
}
