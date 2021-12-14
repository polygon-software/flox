import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/input/create-employee.input';

import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { CompanyService } from '../company/company.service';
import { GetCompanyArgs } from '../company/dto/args/get-company.args';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
  ) {}

  /**
   * Creates a new employee for the user that is currently logged in
   * @param {CreateEmployeeInput} createEmployeeInput
   * @param {Record<string, string>} user - the currently logged in cognito user (userId and username)
   */
  @AnyRole() // TODO restrict to Management
  @Mutation(() => Employee)
  async createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Employee> {
    // Get company where user's UUID matches cognitoID
    const company = await this.companyService.getCompany({
      cognito_id: user.userId,
    } as GetCompanyArgs);

    if (!company) {
      throw new Error(`No company found for ${user.userId}`);
    }
    return await this.employeeService.createEmployee({
      ...createEmployeeInput,
      company,
    });
  }

  /**
   * Gets a list of all employees in the database
   */
  @AdminOnly()
  @Query(() => [Employee], { name: 'allEmployees' })
  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeService.getAllEmployees();
  }

  /**
   * Get the list of employees for the currently logged in company account
   */
  @AnyRole() // TODO management only
  @Query(() => [Employee], { name: 'myEmployees' })
  async getMyEmployees(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Employee[]> {
    // Get company where user's UUID matches cognitoID
    const company = await this.companyService.getCompany({
      cognito_id: user.userId,
    } as GetCompanyArgs);

    if (!company) {
      throw new Error(`No company found for ${user.userId}`);
    }

    return await this.employeeService.getEmployees(company);
  }

  /**
   * Updates an employee's data
   * @param {UpdateEmployeeInput} updateEmployeeInput - company data to change
   */
  @AnyRole() // TODO restrict to appropriate roles
  @Mutation(() => Employee)
  async updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
  ): Promise<Employee> {
    return await this.employeeService.updateEmployee(updateEmployeeInput);
  }
}
