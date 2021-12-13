import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DuplicateProductInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
