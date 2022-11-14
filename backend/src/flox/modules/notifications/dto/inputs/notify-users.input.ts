import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import NotifyInput from './notify.input';

@InputType()
export default class NotifyUsersInput extends NotifyInput {
  @Field(() => [ID], {
    description: 'Uuids of users that shall receive notifications',
  })
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  recipients: string[];
}
