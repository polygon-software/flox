import { ArgsType, Field, ID } from '@nestjs/graphql';

import GetAllArgs from '../../../abstracts/crud/dto/args/get-all.args';

@ArgsType()
export default class GetAllOfUserArgs extends GetAllArgs {
  @Field(() => ID, {
    description: 'User UUID',
  })
  userUuid: string;
}
