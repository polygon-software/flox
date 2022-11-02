import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export default class RemoveUserFromUserGroupInput {
  @Field(() => ID, {
    description: 'Uuid of group to which user shall be added',
  })
  @IsUUID()
  userGroupUuid: string;

  @Field(() => ID, {
    description: 'Uuid of user that shall be removed from group',
  })
  @IsUUID()
  userUuid: string;
}
