import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export default abstract class SearchQueryOutputInterface<T> {
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field({ description: 'Data that fits query' })
  data: T[];
}
