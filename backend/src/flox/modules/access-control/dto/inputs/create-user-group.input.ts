import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import CreateInput from '../../../abstracts/crud/inputs/create.input';

@InputType()
export default class CreateUserGroupInput extends CreateInput {
  @Field(() => String, {
    description: 'Name of group',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
