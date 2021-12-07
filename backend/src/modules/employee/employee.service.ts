import { Injectable } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/input/create-employee.input';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { UserService } from '../user/user.service';
import { ROLES } from '../../ENUM/ENUMS';
import { sendPasswordChangeEmail } from '../../email/helper';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private userService: UserService,
  ) {}

  /**
   * Creates a new employee using the given data, and sets default values
   * @param {CreateEmployeeInput} createEmployeeInput - the company's data, containing all mandatory fields
   */
  async createEmployee(
    createEmployeeInput: CreateEmployeeInput,
  ): Promise<Employee> {
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createEmployeeInput.email,
      password,
    );
    await sendPasswordChangeEmail(
      createEmployeeInput.email,
      password,
      ROLES.EMPLOYEE,
    );
    const employee = this.employeeRepository.create(createEmployeeInput);
    await this.userService.create({
      role: ROLES.EMPLOYEE,
      uuid: cognitoId,
      fk: employee.uuid,
    });

    return await this.employeeRepository.save(employee);
  }

  /**
   * Returns all employees within the database
   */
  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  /**
   * Gets a list of companies by UUIDs
   * @param {Company} company - the company whose employees shall be fetched
   */
  async getEmployees(company: Company): Promise<Employee[]> {
    return await this.employeeRepository.find({
      company: company,
    });
  }

  /**
   * Updates any given values of an employee (by UUID)
   * @param {UpdateEmployeeInput} updateEmployeeInput - the employee update data
   */
  async updateEmployee(
    updateEmployeeInput: UpdateEmployeeInput,
  ): Promise<Employee> {
    await this.employeeRepository.update(updateEmployeeInput.uuid, {
      ...updateEmployeeInput,
    });
    return await this.employeeRepository.findOne(updateEmployeeInput.uuid);
  }
  // TODO: Add remove/update/find functionalities as needed
}
