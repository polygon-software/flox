import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminOnly } from '../../auth/authorization.decorator';
import { SoiAdmin } from './entities/soi-admin.entity';
import { CreateSoiAdminInput } from './dto/input/create-soi-admin.input';
import { SoiAdminService } from './soi-admin.service';

@Resolver(() => SoiAdmin)
export class SoiAdminResolver {
  constructor(private readonly soiAdminService: SoiAdminService) {}

  @AdminOnly()
  @Mutation(() => SoiAdmin)
  /**
   * @param {CreateSoiAdminInput} createSoiAdminInput - Fields for SOI Admin
   * @returns {Promise<SoiAdmin>} - SOI Admin
   */
  async createSoiAdmin(
    @Args('createSoiAdminInput') createSoiAdminInput: CreateSoiAdminInput,
  ): Promise<SoiAdmin> {
    return this.soiAdminService.createSoiAdmin(createSoiAdminInput);
  }
}
