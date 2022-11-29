import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export default class UpdateInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
