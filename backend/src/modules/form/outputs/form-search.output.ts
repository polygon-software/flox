import { Field, ObjectType } from '@nestjs/graphql';

import Form from '../entities/form.entity';
import SearchQueryOutputInterface from '../../../flox/modules/abstracts/search/dto/output/search-interface.output';

@ObjectType()
export default class FormSearchOutput
  implements SearchQueryOutputInterface<Form>
{
  @Field(() => Number, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [Form], { description: 'Forms that fit query' })
  data: Form[];
}
