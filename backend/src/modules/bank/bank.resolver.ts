import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { BankService } from './bank.service';
import { Bank } from './entities/bank.entity';
import { AnyRole } from '../../auth/authorization.decorator';
import { CreateBankInput } from './dto/input/create-bank.input';

@Resolver(() => Bank)
export class BankResolver {
  constructor(private readonly bankService: BankService) {}

  @AnyRole()
  @Mutation(() => Bank)
  async createBank(
    @Args('createBankInput') createBankInput: CreateBankInput,
  ): Promise<Bank> {
    return this.bankService.createBank(createBankInput);
  }
}
