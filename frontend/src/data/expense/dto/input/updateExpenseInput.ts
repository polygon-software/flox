import { IsOptional, IsString } from 'class-validator';

import CreateExpenseInput from 'src/data/expense/dto/input/createExpenseInput';
import ExpenseEntity from 'src/data/expense/entities/expenseEntity';

/**
 * A class representing an input object for updating an expense data object
 */
export default class UpdateExpenseInput extends CreateExpenseInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateExpenseInput
   * @param [name] - The name of the expense
   * @param [timeAmount] - The time amount of the expense
   * @param [discount] - The discount for the expense
   * @param [uuid] - The uuid of the expense
   */
  constructor(
    name?: string,
    timeAmount?: number,
    discount?: number,
    uuid?: string
  ) {
    super();
    this.uuid = uuid;
    this.name = name;
    this.timeAmount = timeAmount;
    this.discount = discount;
  }

  /**
   * Transform ExpenseEntity to input
   * @param {ExpenseEntity} expense - The expense entity from the database
   * @returns {UpdateExpenseInput} - The expense input for update
   */
  static fromExpense(expense?: ExpenseEntity): UpdateExpenseInput {
    return new UpdateExpenseInput(
      expense?.name,
      expense?.timeAmount,
      expense?.discount,
      expense?.uuid
    );
  }
}
