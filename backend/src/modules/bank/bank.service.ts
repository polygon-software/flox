import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { CreateBankInput } from './dto/input/create-bank.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { ROLE } from '../../ENUM/ENUMS';
import { UserService } from '../user/user.service';
import { createUserlessBankInput } from './dto/input/create-userless-bank.input';
import { generateHumanReadableId } from '../../helpers';

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

  /**
   * @param {string} uuid - uuid of bank
   * @return {Promise<Bank>} - bank if found
   */
  async findBank(uuid: string) {
    return this.bankRepository.findOne(uuid);
  }

  /**
   * Create a bank without an associated user
   * @param {createUserlessBankInput} createBankInput - mimimal info for new bank
   * @return {Promise<Bank>} - new Bank
   */
  async createUserlessBank(
    createBankInput: createUserlessBankInput,
  ): Promise<Bank> {
    const newBank = this.bankRepository.create({
      ...createBankInput,
      first_name: '-',
      last_name: '-',
      email: '-',
      readable_id: generateHumanReadableId(),
    });
    return this.bankRepository.save(newBank);
  }

  /**
   * Find a bank
   * @param {String} name - name of bank
   * @returns {Promise<Bank>} - bank
   */
  findBankByName(name: string): Promise<Bank> {
    return this.bankRepository.findOne({ name });
  }

  /**
   * Find a bank
   * @param {String} abbreviation - abbreviation of bank
   * @returns {Promise<Bank>} - bank
   */
  findBankByAbbreviation(abbreviation: string): Promise<Bank> {
    return this.bankRepository.findOne({ abbreviation });
  }

  /**
   * All banks
   * @returns {Promise<Bank[]>} - all Banks
   */
  allBanks(): Promise<Bank[]> {
    return this.bankRepository.find();
  }
}
