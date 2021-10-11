import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGlobiInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
