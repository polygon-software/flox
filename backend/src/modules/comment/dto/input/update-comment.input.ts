import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String)
  @IsString()
  content: string;
}

//TODO Add missing fields (likes, replies, etc.)
