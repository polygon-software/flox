import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
