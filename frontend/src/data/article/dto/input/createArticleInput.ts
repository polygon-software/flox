import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * A class representing an input object for creating an article data object
 */
export default class CreateArticleInput {
  @IsString()
  @IsOptional()
  articleNumber?: string;

  @IsString()
  @IsOptional()
  manufacturerNumber?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}
