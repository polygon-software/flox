import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/input/create-employee.input';
import { UpdateEmployeeInput } from './dto/input/update-employee.input';
import { Public } from '../auth/authentication.decorator';
import { CurrentUser } from '../auth/authorization.decorator';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Public() // TODO
  @Mutation(() => Employee)
  createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
    @CurrentUser() user: Record<string, unknown>,
  ): Promise<Employee> {
    console.log('CREATE called by user', user);
    return this.employeeService.createEmployee(createEmployeeInput);
  }

  @Query(() => [Employee], { name: 'employee' })
  findAll() {
    return this.employeeService.findAll();
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
