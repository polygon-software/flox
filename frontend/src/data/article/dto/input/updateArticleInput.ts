import { IsOptional, IsString } from 'class-validator';

import CreateArticleInput from 'src/data/article/dto/input/createArticleInput';

/**
 * A class representing an input object for updating an article data object
 */
export default class UpdateArticleInput extends CreateArticleInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
