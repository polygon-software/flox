import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';

@InputType()
export default class CreateAccessControlledInput {
  @Field(() => Boolean)
  @IsBoolean()
  publicReadAccess = false;

  @Field(() => Boolean)
  @IsBoolean()
  loggedInReadAccess = false;

  @Field(() => [ID])
  @IsUUID(4, { each: true })
  readAccess: string[] = [];

  @Field(() => [ID])
  @IsUUID(4, { each: true })
  writeAccess: string[] = [];
}
