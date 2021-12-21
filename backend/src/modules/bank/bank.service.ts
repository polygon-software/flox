import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { CreateBankInput } from './dto/input/create-bank.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLE } from '../../ENUM/ENUMS';
import { UserService } from '../user/user.service';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new Bank
   * @param {CreateBankInput} createBankInput - Input needed to create a new Bank
   * @returns {Promise<Bank>} - new Bank
   */
  async createBank(createBankInput: CreateBankInput): Promise<Bank> {
    // Create a Cognito account with a random password
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createBankInput.email,
      password,
    );

    // TODO return password/credentials in some way, so admin can be shown a popup

    // Create the SoiAdmin and User in the database
    const bank = this.bankRepository.create({ ...createBankInput, offers: [] });
    await this.userService.create({
      role: ROLE.BANK,
      uuid: cognitoId,
      fk: bank.uuid,
    });
    return this.bankRepository.save(bank);
  }
}
