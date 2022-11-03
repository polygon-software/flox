import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import CreateInput from '../../../abstracts/crud/inputs/create.input';

@InputType()
export default class CreateUserGroupInput extends CreateInput {
  @Field(() => String, {
    description: 'Name of group',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [ID], { nullable: true, defaultValue: [] })
  @IsArray()
  @IsOptional()
  users: string[];
}
