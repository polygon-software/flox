import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEmployeeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
