import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  cognitoUuid: string;
}
