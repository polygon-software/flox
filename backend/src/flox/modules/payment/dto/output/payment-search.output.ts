import { Field, ObjectType } from '@nestjs/graphql';

import SearchQueryOutputInterface from '../../../abstracts/search/dto/output/search-interface.output';
import Payment from '../../entities/payment.entity';

@ObjectType()
export default class PaymentSearchOutput
  implements SearchQueryOutputInterface<Payment>
{
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [Payment], { description: 'Payments that fit query' })
  data: Payment[];
}
