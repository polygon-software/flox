import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
/**
 * User update Input
 * TODO adapt appropriately
 */
export class UpdateUserInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
