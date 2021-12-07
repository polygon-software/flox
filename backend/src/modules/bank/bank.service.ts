import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { CreateBankInput } from './dto/input/create-bank.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLES } from '../../ENUM/ENUMS';
import { UserService } from '../user/user.service';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    private userService: UserService,
  ) {}

  async createBank(createBankInput: CreateBankInput): Promise<Bank> {
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createBankInput.email,
      password,
    );
    await sendPasswordChangeEmail(
      createBankInput.email,
      password,
      ROLES.EMPLOYEE,
    );
    const bank = this.bankRepository.create({ ...createBankInput, offers: [] });
    await this.userService.create({
      role: ROLES.EMPLOYEE,
      uuid: cognitoId,
      fk: bank.uuid,
    });
    return this.bankRepository.save(bank);
  }
}
