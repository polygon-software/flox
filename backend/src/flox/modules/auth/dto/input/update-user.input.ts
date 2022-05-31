import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
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
