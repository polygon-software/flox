import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteFileInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
