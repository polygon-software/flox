import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteAnnouncementInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
