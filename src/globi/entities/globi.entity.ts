import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Globi {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
