import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SoiEmployee } from './entities/soi-employee.entity';
import { CreateSoiEmployeeInput } from './dto/input/create-soi-employee.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLE } from '../../ENUM/ENUMS';

@Injectable()
export class SoiEmployeeService {
  constructor(
    @InjectRepository(SoiEmployee)
    private soiEmployeeRepository: Repository<SoiEmployee>,
    private userService: UserService,
  ) {}

  /**
   * Create a new SOI Employee
   * @param {CreateSoiEmployeeInput} createSoiEmployeeInput - input necessary to create SOI Employee
   */
  async createSoiEmployee(
    createSoiEmployeeInput: CreateSoiEmployeeInput,
  ): Promise<SoiEmployee> {
    // Create a Cognito account with a random password
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createSoiEmployeeInput.email,
      password,
    );

    // Send password reset email with the current password embedded
    await sendPasswordChangeEmail(
      createSoiEmployeeInput.email,
      password,
      ROLE.SOI_EMPLOYEE,
    );

    // Create the SoiAdmin and User in the database
    const soiEmployee = this.soiEmployeeRepository.create(
      createSoiEmployeeInput,
    );
    await this.userService.create({
      role: ROLE.SOI_EMPLOYEE,
      uuid: cognitoId,
      fk: soiEmployee.uuid,
    });
    return this.soiEmployeeRepository.save(soiEmployee);
  }
}
