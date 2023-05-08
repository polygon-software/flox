import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * A class representing an input object for creating an expense data object
 */
export default class CreateExpenseInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  timeAmount?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}
