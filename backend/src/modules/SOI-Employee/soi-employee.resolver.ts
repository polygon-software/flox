import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminOnly } from '../../auth/authorization.decorator';
import { SoiEmployee } from './entities/soi-employee.entity';
import { CreateSoiEmployeeInput } from './dto/input/create-soi-employee.input';
import { SoiEmployeeService } from './soi-employee.service';

@Resolver(() => SoiEmployee)
export class SoiEmployeeResolver {
  constructor(private readonly soiEmployeeService: SoiEmployeeService) {}

  @AdminOnly()
  @Mutation(() => SoiEmployee)
  /**
   * @param {CreateSoiEmployeeInput} createSoiEmployeeInput - Fields for SOI employee
   * @returns {Promise<SoiEmployee>} - SOI Employee
   */
  async createSoiEmployee(
    @Args('createSoiEmployeeInput')
    createSoiEmployeeInput: CreateSoiEmployeeInput,
  ): Promise<SoiEmployee> {
    return this.soiEmployeeService.createSoiEmployee(createSoiEmployeeInput);
  }
}
