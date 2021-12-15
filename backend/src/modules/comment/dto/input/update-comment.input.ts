import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String)
  @IsString()
  content: string;
}

//TODO: Add missing operations
