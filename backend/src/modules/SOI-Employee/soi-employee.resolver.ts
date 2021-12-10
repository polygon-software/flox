import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnyRole } from '../../auth/authorization.decorator';
import { SoiEmployee } from './entities/soi-employee.entity';
import { CreateSoiEmployeeInput } from './dto/input/create-soi-employee.input';
import { SoiEmployeeService } from './soi-employee.service';

@Resolver(() => SoiEmployee)
export class SoiEmployeeResolver {
  constructor(private readonly soiEmployeeService: SoiEmployeeService) {}

  @AnyRole()
  @Mutation(() => SoiEmployee)
  async createSoiEmployee$(
    @Args('createSoiEmployeeInput')
    createSoiEmployeeInput: CreateSoiEmployeeInput,
  ): Promise<SoiEmployee> {
    return this.soiEmployeeService.createSoiEmployee(createSoiEmployeeInput);
  }
}
