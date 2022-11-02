import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import UpdateInput from '../../../abstracts/crud/inputs/update.input';

@InputType()
export default class UpdateUserGroupInput extends UpdateInput {
  @Field(() => String, {
    description: 'Name of group',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
