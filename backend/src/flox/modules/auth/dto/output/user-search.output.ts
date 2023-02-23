import { Field, ObjectType } from '@nestjs/graphql';

import SearchQueryOutputInterface from '../../../abstracts/search/dto/output/search-interface.output';
import User from '../../entities/user.entity';

@ObjectType()
export default class UserSearchOutput
  implements SearchQueryOutputInterface<User>
{
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [User], { description: 'Users that fit query' })
  data: User[];
}
