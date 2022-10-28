import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { CreateInput } from '../../../abstracts/crud/inputs/create.input';

@InputType()
export class CreateUserInput extends CreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  cognitoUuid: string;

  @Field(() => String, { nullable: true })
  @IsString()
  role: string;
}
