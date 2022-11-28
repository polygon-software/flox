import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import UpdateInput from '../../../abstracts/crud/dto/input/update.input';

@InputType()
export default class UpdateUserGroupInput extends UpdateInput {
  @Field(() => String, {
    description: 'Name of group',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  name: string;
}
