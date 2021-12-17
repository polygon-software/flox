import { Injectable } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/input/create-employee.input';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { UserService } from '../user/user.service';
import { ROLE } from '../../ENUM/ENUMS';
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
   * @returns {Promise<Employee>} - new employee
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
      ROLE.EMPLOYEE,
    );
    const employee = this.employeeRepository.create(createEmployeeInput);
    await this.userService.create({
      role: ROLE.EMPLOYEE,
      uuid: cognitoId,
      fk: employee.uuid,
    });

    return await this.employeeRepository.save(employee);
  }

  /**
   * Returns all employees within the database
   * @returns {Promise<Employee[]>} - employees
   */
  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  /**
   * Gets a list of companies by UUIDs
   * @param {Company} company - the company whose employees shall be fetched
   * @returns {Promise<Employee[]>} - employees of company
   */
  async getEmployees(company: Company): Promise<Employee[]> {
    return this.employeeRepository.find({
      company: company,
    });
  }

  /**
   * Updates any given values of an employee (by UUID)
   * @param {UpdateEmployeeInput} updateEmployeeInput - the employee update data
   * @returns {Promise<Employee>} - updated Employee
   */
  async updateEmployee(
    updateEmployeeInput: UpdateEmployeeInput,
  ): Promise<Employee> {
    await this.employeeRepository.update(updateEmployeeInput.uuid, {
      ...updateEmployeeInput,
    });
    return await this.employeeRepository.findOne(updateEmployeeInput.uuid);
  }

  /**
   * get a specific employee
   * @param {string} uuid - uuid
   * @returns {Promise<Employee>} - employee
   */
  async getEmployee(uuid: string): Promise<Employee> {
    return this.employeeRepository.findOne(uuid);
  }
  // TODO: Add remove/update/find functionalities as needed
}
