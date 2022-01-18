import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { BankService } from './bank.service';
import { Bank } from './entities/bank.entity';
import {
  BankOnly,
  CurrentUser,
  EmployeeOnly,
  SOIOnly,
} from '../../auth/authorization.decorator';
import { CreateBankInput } from './dto/input/create-bank.input';
import { ROLE } from '../../ENUM/ENUMS';
import { UserService } from '../user/user.service';

@Resolver(() => Bank)
export class BankResolver {
  constructor(
    private readonly bankService: BankService,
    private readonly userService: UserService,
  ) {}

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

  /**
   * Gets all banks
   * @returns {Promise<Bank[]>} - all banks
   */
  @SOIOnly()
  @Query(() => [Bank])
  async getBanks(): Promise<Bank[]> {
    return this.bankService.allBanks();
  }

  /**
   * Gets the name of all banks
   * @returns {Promise<String[]>} - name of all banks
   */
  @EmployeeOnly()
  @Query(() => [String])
  async getBankNames(): Promise<string[]> {
    const banks = await this.bankService.allBanks();
    let names: Array<string> = [];
    banks.forEach((bank) => {
      names = names.concat(bank.name);
    });
    return names;
  }

  /**
   * Get the currently logged in bank, if he is a bank
   * @param {Record<string, string>} user - the currently logged in cognito user (userId and username)
   * @returns {Promise<Bank>} - The bank
   */
  @BankOnly()
  @Query(() => Bank, { name: 'getMyBank' })
  async getMyBank(@CurrentUser() user: Record<string, string>): Promise<Bank> {
    const dbUser = await this.userService.getUser({ uuid: user.userId });
    if (!dbUser || dbUser.role !== ROLE.BANK) {
      throw new Error('User is not an Bank');
    }
    return this.bankService.getMyBank(dbUser.uuid);
  }
}
