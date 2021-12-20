import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SoiEmployee } from './entities/soi-employee.entity';
import { CreateSoiEmployeeInput } from './dto/input/create-soi-employee.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLE } from '../../ENUM/ENUMS';
import { generateHumanReadableId } from '../../helpers';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class SoiEmployeeService {
  constructor(
    @InjectRepository(SoiEmployee)
    private readonly soiEmployeeRepository: Repository<SoiEmployee>,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new SOI Employee
   * @param {CreateSoiEmployeeInput} createSoiEmployeeInput - input necessary to create SOI Employee
   * @returns {Promise<SoiEmployee>} - SOI Employee
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

    // Generate human-readable ID and search for existing company with same ID
    let readableId = generateHumanReadableId();
    let existingEmployee = await this.soiEmployeeRepository.findOne({
      readable_id: readableId,
    });

    // If ID already exists, regenerate
    while (existingEmployee !== null && existingEmployee !== undefined) {
      readableId = generateHumanReadableId();
      existingEmployee = await this.soiEmployeeRepository.findOne({
        readable_id: readableId,
      });
    }

    // Create the SoiAdmin and User in the database
    const soiEmployee = this.soiEmployeeRepository.create({
      ...createSoiEmployeeInput,
      readable_id: readableId,
    });

    const soiEmployeeEntry = await this.soiEmployeeRepository.save(soiEmployee);

    await this.userService.create({
      role: ROLE.SOI_EMPLOYEE,
      uuid: cognitoId,
      fk: soiEmployeeEntry.uuid,
    });

    return soiEmployeeEntry;
  }

  /**
   * Returns all SOI employees within the database
   * @returns {Promise<SoiEmployee[]>} - employees
   */
  async getAllSoiEmployees(): Promise<SoiEmployee[]> {
    return this.soiEmployeeRepository.find();
  }
}
