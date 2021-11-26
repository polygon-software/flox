import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/input/create-employee.input';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';
import { Public } from '../auth/authentication.decorator';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../auth/authorization.decorator';
import { CompanyService } from '../company/company.service';
import { GetCompanyArgs } from '../company/dto/args/get-company.args';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
  ) {}

  @AnyRole() // TODO
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
    return this.employeeService.createEmployee({
      ...createEmployeeInput,
      company,
    });
  }

  @AdminOnly()
  @Query(() => [Employee], { name: 'allEmployees' })
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeService.getAllEmployees();
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

    return this.employeeService.getEmployees(company);
  }

  @Query(() => Employee, { name: 'employee' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.employeeService.findOne(id);
  }

  @Mutation(() => Employee)
  updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
  ) {
    return this.employeeService.update(
      updateEmployeeInput.id,
      updateEmployeeInput,
    );
  }

  @Mutation(() => Employee)
  removeEmployee(@Args('id', { type: () => Int }) id: number) {
    return this.employeeService.remove(id);
  }
}
