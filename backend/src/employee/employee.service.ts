import { Injectable } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/input/create-employee.input';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { GetCompaniesArgs } from '../company/dto/args/get-companies.args';
import { Company } from '../company/entities/company.entity';
import {UpdateCompanyInput} from "../company/dto/input/update-company.input";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Creates a new employee using the given data, and sets default values
   * @param {CreateEmployeeInput} createEmployeeInput - the company's data, containing all mandatory fields
   */
  async createEmployee(
    createEmployeeInput: CreateEmployeeInput,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.create(createEmployeeInput);

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
      ...updateEmployeeInput, // TODO ensure UUID is immutable
    });
    return await this.employeeRepository.findOne(updateEmployeeInput.uuid);
  }

  // TODO: Add remove/update/find functionalities as needed
}
