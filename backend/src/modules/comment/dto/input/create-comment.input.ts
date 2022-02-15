import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  user_uuid: string;

  @Field(() => String)
  @IsString()
  content: string;

  @Field(() => ID)
  product_uuid: string;
}
