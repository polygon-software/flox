import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SoiEmployee } from './entities/soi-employee.entity';
import { CreateSoiEmployeeInput } from './dto/input/create-soi-employee.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLES } from '../../ENUM/ENUMS';

@Injectable()
export class SoiEmployeeService {
  constructor(
    @InjectRepository(SoiEmployee)
    private soiEmployeeRepository: Repository<SoiEmployee>,
    private userService: UserService,
  ) {}

  /**
   * Create a new SOI Employee
   * @param createSoiEmployeeInput
   */
  async createSoiEmployee(
    createSoiEmployeeInput: CreateSoiEmployeeInput,
  ): Promise<SoiEmployee> {
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createSoiEmployeeInput.email,
      password,
    );
    await sendPasswordChangeEmail(
      createSoiEmployeeInput.email,
      password,
      ROLES.SOI_EMPLOYEE,
    );
    const soiEmployee = this.soiEmployeeRepository.create(
      createSoiEmployeeInput,
    );
    await this.userService.create({
      role: ROLES.SOI_EMPLOYEE,
      uuid: cognitoId,
      fk: soiEmployee.uuid,
    });
    return this.soiEmployeeRepository.save(soiEmployee);
  }
}
