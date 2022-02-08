import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { CreateBankInput } from './dto/input/create-bank.input';
import { createCognitoAccount } from '../../auth/authService';
import { ROLE } from '../../ENUM/ENUMS';
import { UserService } from '../user/user.service';
import { CreateUserlessBankInput } from './dto/input/create-userless-bank.input';
import { generateHumanReadableId } from '../../helpers';
import { GetBankArgs } from './dto/args/get-bank.args';
import { BANK_SUGGESTIONS } from '../../CONSTANTS/BANK';
import { prettify } from '../../helpers/log-helper';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Create a new Bank
   * @param {CreateBankInput} createBankInput - Input needed to create a new Bank
   * @returns {Promise<{bank:Bank, password: string}>} - new Bank
   */
  async createBank(createBankInput: CreateBankInput): Promise<Bank> {
    // Create a Cognito account with a random password
    const cognitoId = await createCognitoAccount(
      createBankInput.email,
      createBankInput.password,
    );

    // Create the SoiAdmin and User in the database
    const bank = this.bankRepository.create({
      ...createBankInput,
      offers: [],
      own_mortgages: [],
      readable_id: generateHumanReadableId(ROLE.BANK),
    });
    const savedBank = await this.bankRepository.save(bank);
    await this.userService.create({
      role: ROLE.BANK,
      uuid: cognitoId,
      fk: bank.uuid,
    });
    this.logger.warn(`Bank created:\n${prettify(savedBank)}`);
    return savedBank;
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
   * @param {CreateUserlessBankInput} createBankInput - mimimal info for new bank
   * @return {Promise<Bank>} - new Bank
   */
  async createUserlessBank(
    createBankInput: CreateUserlessBankInput,
  ): Promise<Bank> {
    const newBank = this.bankRepository.create({
      ...createBankInput,
      first_name: '-',
      last_name: '-',
      email: '-',
      phone: '-',
      readable_id: generateHumanReadableId(ROLE.BANK),
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

  /**
   * Get a bank by uuid
   * @param {GetBankArgs} getBankArgs - getter arguments, containing UUID
   * @returns {Promise<Bank>} - the bank
   */
  async getBank(getBankArgs: GetBankArgs): Promise<Bank> {
    const bank = await this.bankRepository.findOne(getBankArgs.uuid, {
      relations: ['offers', 'own_mortgages', 'offers.dossier'],
    });

    if (!bank) {
      throw new Error(`No bank found for ${getBankArgs.uuid}`);
    }

    return bank;
  }

  /**
   * Returns a list of bank name/abbreviation suggestions
   * @returns {Promise<Bank[]>} - all bank name/abbreviation suggestions
   */
  async getBankNameSuggestions() {
    // Set a default UUID, because query expects one
    const defaultUuid = 'bank-suggestion-';

    // Imported from constants file
    let nameSuggestions = BANK_SUGGESTIONS as Record<string, string>[];

    // Filter suggestions: Exclude banks that are already present in bank database
    const existingBanks = await this.bankRepository.find();
    const existingBankAbbreviations: string[] = [];
    const existingBankNames: string[] = [];
    existingBanks.forEach((existingBank) => {
      existingBankAbbreviations.push(existingBank.abbreviation);
      existingBankNames.push(existingBank.name);
    });

    // Filter out existing ones
    nameSuggestions = nameSuggestions.filter((suggestion) => {
      return (
        !existingBankAbbreviations.includes(suggestion.abbreviation) &&
        !existingBankNames.includes(suggestion.name)
      );
    });

    // Add a UUID to all suggestions
    for (let i = 0; i < nameSuggestions.length; i++) {
      nameSuggestions[i].uuid = `${defaultUuid}${i}`;
    }

    // Explicit type conversion, since we don't return all required fields for a bank
    return nameSuggestions as unknown as Bank[];
  }
}
