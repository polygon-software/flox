import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import CreateInput from '../../../abstracts/crud/dto/input/create.input';

@InputType()
export default class CreateUserGroupInput extends CreateInput {
  @Field(() => String, {
    description: 'Name of group',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @Field(() => [ID], { nullable: true, defaultValue: [] })
  @IsArray()
  @IsOptional()
  users: string[];
}
