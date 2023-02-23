import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export default class AddUserToUserGroupInput {
  @Field(() => ID, {
    description: 'Uuid of group to which user shall be added',
  })
  @IsUUID()
  userGroupUuid: string;

  @Field(() => ID, {
    description: 'Uuid of user that shall be added to group',
  })
  @IsUUID()
  userUuid: string;
}
