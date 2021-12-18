import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { BankService } from './bank.service';
import { Bank } from './entities/bank.entity';
import { SOIOnly } from '../../auth/authorization.decorator';
import { CreateBankInput } from './dto/input/create-bank.input';

@Resolver(() => Bank)
export class BankResolver {
  constructor(private readonly bankService: BankService) {}

  @SOIOnly()
  @Mutation(() => Bank)
  /**
   * @param {CreateBankInput} createBankInput - Fields for bank
   * @returns Promise<Bank> - new Bank
   */
  async createBank(
    @Args('createBankInput') createBankInput: CreateBankInput,
  ): Promise<Bank> {
    return this.bankService.createBank(createBankInput);
  }
}
