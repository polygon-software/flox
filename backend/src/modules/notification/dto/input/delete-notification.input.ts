import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteNotificationInput {
  @Field(() => ID, { description: 'UUID' })
  @IsUUID()
  uuid: string;
}
