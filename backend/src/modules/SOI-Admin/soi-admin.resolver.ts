import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnyRole } from '../../auth/authorization.decorator';
import { SoiAdmin } from './entities/soi-admin.entity';
import { CreateSoiAdminInput } from './dto/input/create-soi-admin.input';
import { SoiAdminService } from './soi-admin.service';

@Resolver(() => SoiAdmin)
export class SoiAdminResolver {
  constructor(private readonly soiAdminService: SoiAdminService) {}

  @AnyRole()
  @Mutation(() => SoiAdmin)
  async createSoiAdmin(
    @Args('createSoiAdminInput') createSoiAdminInput: CreateSoiAdminInput,
  ): Promise<SoiAdmin> {
    return this.soiAdminService.createSoiAdmin(createSoiAdminInput);
  }
}
