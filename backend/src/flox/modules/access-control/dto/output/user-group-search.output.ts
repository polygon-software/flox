import { Field, ObjectType } from '@nestjs/graphql';

import SearchQueryOutputInterface from '../../../abstracts/search/dto/output/search-interface.output';
import UserGroup from '../../entities/user-group.entity';

@ObjectType()
export default class UserGroupSearchOutput
  implements SearchQueryOutputInterface<UserGroup>
{
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [UserGroup], { description: 'User Groups that fit query' })
  data: UserGroup[];
}
