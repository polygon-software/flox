import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';

@InputType()
export default class AddUsersToUserGroupInput {
  @Field(() => ID, {
    description: 'Uuid of group to which user shall be added',
  })
  @IsUUID()
  userGroupUuid: string;

  @Field(() => [ID], {
    description: 'Uuids of users that shall be added to group',
  })
  @IsArray()
  userUuids: string[];
}
