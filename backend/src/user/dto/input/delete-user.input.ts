import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;
}
