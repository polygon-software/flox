import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateArticleInput from './create-article.input';

@InputType()
export default class UpdateArticleInput extends PartialType(
  CreateArticleInput,
) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
