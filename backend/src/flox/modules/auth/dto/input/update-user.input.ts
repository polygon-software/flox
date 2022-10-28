import { Field, ID, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { UpdateInput } from '../../../abstracts/crud/inputs/update.input';

@InputType()
export class UpdateUserInput extends UpdateInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
