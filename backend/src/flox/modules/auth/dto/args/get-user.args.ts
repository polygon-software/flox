import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import GetOneArgs from '../../../abstracts/crud/dto/args/get-one.args';

@ArgsType()
export default class GetUserArgs extends GetOneArgs {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  cognitoUuid: string;
}
