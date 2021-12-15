import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
/**
 * User Deletion input
 */
export class DeleteUserInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
