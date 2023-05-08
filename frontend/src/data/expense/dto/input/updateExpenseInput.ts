import { IsOptional, IsString } from 'class-validator';

import CreateExpenseInput from 'src/data/expense/dto/input/createExpenseInput';

/**
 * A class representing an input object for updating an expense data object
 */
export default class UpdateExpenseInput extends CreateExpenseInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
