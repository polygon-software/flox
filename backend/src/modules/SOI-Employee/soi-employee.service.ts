import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SoiEmployee } from './entities/soi-employee.entity';
import { CreateSoiEmployeeInput } from './dto/input/create-soi-employee.input';
import { createCognitoAccount } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLE } from '../../ENUM/ENUMS';
import { generateHumanReadableId } from '../../helpers';
import { prettify } from '../../helpers/log-helper';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class SoiEmployeeService {
  constructor(
    @InjectRepository(SoiEmployee)
    private readonly soiEmployeeRepository: Repository<SoiEmployee>,
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
    const newAccount = await createCognitoAccount(createSoiEmployeeInput.email);

    // Send password reset email with the current password embedded
    await sendPasswordChangeEmail(
      createSoiEmployeeInput.email,
      newAccount.password,
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

    // Create the SoiEmployee and User in the database
    const soiEmployee = this.soiEmployeeRepository.create({
      ...createSoiEmployeeInput,
      readable_id: readableId,
    });

    const soiEmployeeEntry = await this.soiEmployeeRepository.save(soiEmployee);

    await this.userService.create({
      role: ROLE.SOI_EMPLOYEE,
      uuid: newAccount.cognitoId,
      fk: soiEmployeeEntry.uuid,
    });
    this.logger.warn(`SOI Employee created:\n${prettify(soiEmployee)}`);

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
