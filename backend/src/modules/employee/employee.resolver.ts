import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/input/create-employee.input';

import {
  AdminOnly,
  CompanyOnly,
  CurrentUser,
  EmployeeOnly,
} from '../../auth/authorization.decorator';
import { CompanyService } from '../company/company.service';
import { GetCompanyArgs } from '../company/dto/args/get-company.args';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';
import { UserService } from '../user/user.service';
import { ROLE } from '../../ENUM/ENUMS';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a new employee for the user that is currently logged in
   * @param {CreateEmployeeInput} createEmployeeInput - fields for new employee
   * @param {Record<string, string>} user - the currently logged in cognito user (userId and username)
   * @returns {Promise<Employee>} - new Employee
   */
  @CompanyOnly()
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
    return this.employeeService.createEmployee(createEmployeeInput, company);
  }

  /**
   * Gets a list of all employees in the database
   * @returns {Promise<Employee[]>} - all employees
   */
  @AdminOnly()
  @Query(() => [Employee], { name: 'allEmployees' })
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeService.getAllEmployees();
  }

  /**
   * Get the list of employees for the currently logged in company account
   * @param {Record<string, string>} user - the currently logged in cognito user (userId and username)
   * @returns { Promise<Employee[]>} - Employees
   */
  @CompanyOnly()
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
   * Get the currently logged in employee, if he is an employee
   * @param {Record<string, string>} user - the currently logged in cognito user (userId and username)
   * @returns {Promise<Employee>} - The Employee
   */
  @EmployeeOnly()
  @Query(() => Employee, { name: 'myEmployee' })
  async getMyEmployee(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Employee> {
    const dbUser = await this.userService.getUser({ uuid: user.userId });
    if (!dbUser || dbUser.role !== ROLE.EMPLOYEE) {
      return undefined;
    }
    return this.employeeService.getEmployee(dbUser.fk);
  }

  /**
   * Updates an employee's data
   * @param {UpdateEmployeeInput} updateEmployeeInput - company data to change
   * @param {Record<string, string>} user - the currently logged in cognito user (userId and username)
   * @returns {Promise<Employee>} - updated employee
   */
  @CompanyOnly()
  @Mutation(() => Employee)
  async updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Employee> {
    // Admin has access
    const dbUser = await this.userService.getUser({ uuid: user.userId });
    if (dbUser.role === ROLE.SOI_ADMIN) {
      return this.employeeService.updateEmployee(updateEmployeeInput);
    }

    // Company of employee has access
    const company = await this.companyService.getCompany({
      cognito_id: user.userId,
    } as GetCompanyArgs);
    const myEmployees = await this.employeeService.getEmployees(company);
    if (
      myEmployees.some((employee) => employee.uuid === updateEmployeeInput.uuid)
    ) {
      return this.employeeService.updateEmployee(updateEmployeeInput);
    }
  }
}
