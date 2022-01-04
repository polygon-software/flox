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
import { CompanyService } from '../company/company.service';
import { generateHumanReadableId } from '../../helpers';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}

  /**
   * Creates a new employee using the given data, and sets default values
   * @param {CreateEmployeeInput} createEmployeeInput - the employee's data, containing all mandatory fields
   * @param {Company} company - the company
   * @returns {Promise<Employee>} - new employee
   */
  async createEmployee(
    createEmployeeInput: CreateEmployeeInput,
    company: Company,
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
    const employee = this.employeeRepository.create({
      ...createEmployeeInput,
      company,
      readable_id: generateHumanReadableId(), //Todo Collision Prevention
    });
    const newEmployee = await this.employeeRepository.save(employee);
    await this.userService.create({
      role: ROLE.EMPLOYEE,
      uuid: cognitoId,
      fk: newEmployee.uuid,
    });

    return newEmployee;
  }

  /**
   * Returns all employees within the database
   * @returns {Promise<Employee[]>} - employees
   */
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find();
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
    return this.employeeRepository.findOne(updateEmployeeInput.uuid);
  }

  /**
   * get a specific employee
   * @param {string} uuid - uuid
   * @returns {Promise<Employee>} - employee
   */
  async getEmployee(uuid: string): Promise<Employee> {
    return this.employeeRepository.findOne(uuid, { relations: ['company'] });
  }

  /**
   * Get the Employee of the currently logged in user
   * @param {string} cognitoId - the employees users id
   * @returns {Promise<Employee>} - The employee
   */
  async getMyEmployee(cognitoId: string): Promise<Employee> {
    const user = await this.userService.getUser({ uuid: cognitoId });
    if (user && user.role === ROLE.EMPLOYEE) {
      return this.employeeRepository.findOne(user.fk, {
        relations: [
          'company',
          'dossiers',
          'dossiers.original_bank',
          'dossiers.offers',
          'dossiers.offers.bank',
        ],
      });
    }
    throw new Error(
      `User is not an Employee but a ${
        user ? String(user.role) : 'unauthenticated'
      }`,
    );
  }
}