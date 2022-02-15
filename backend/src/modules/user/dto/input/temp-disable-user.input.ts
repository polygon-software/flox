import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID } from 'class-validator';

@InputType()
/**
 * Input for temporarily disabling a user
 */
export class TempDisableUserInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => Date)
  @IsDate()
  until: Date;
}
