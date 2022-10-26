import SearchQueryOutputInterface from '../../abstracts/search/outputs/search-query-interface.output';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserQueryOutput implements SearchQueryOutputInterface<User> {
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [User], { description: 'Users that fit query' })
  data: User[];
}
