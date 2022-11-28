import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export default class ManipulateAccessGroupsInput {
  @Field(() => ID)
  @IsUUID(4)
  uuid: string;

  @Field(() => [ID])
  @IsUUID(4, { each: true })
  @IsOptional()
  addReadAccess: string[] = [];

  @Field(() => [ID])
  @IsUUID(4, { each: true })
  @IsOptional()
  removeReadAccess: string[] = [];

  @Field(() => [ID])
  @IsUUID(4, { each: true })
  @IsOptional()
  addWriteAccess: string[] = [];

  @Field(() => [ID])
  @IsUUID(4, { each: true })
  @IsOptional()
  removeWriteAccess: string[] = [];
}
