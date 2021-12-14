import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnyRole } from '../../auth/authorization.decorator';
import { SoiAdmin } from './entities/soi-admin.entity';
import { CreateSoiAdminInput } from './dto/input/create-soi-admin.input';
import { SoiAdminService } from './soi-admin.service';

@Resolver(() => SoiAdmin)
/**
 * A SOI Admin Resolver
 */
export class SoiAdminResolver {
  /**
   * A constructor for the SOI Admin Resolver
   * @param {SoiAdminService} soiAdminService - An SOI admin Service. Implicitly passed in
   */
  constructor(private readonly soiAdminService: SoiAdminService) {}

  @AnyRole()
  @Mutation(() => SoiAdmin)
  /**
   * Create an SOI Admin
   * @param {CreateSoiAdminInput} createSoiAdminInput - Field with with to create an SOI Admin
   * @return {SoiAdmin} - The created SOI admin
   */
  async createSoiAdmin(
    @Args('createSoiAdminInput') createSoiAdminInput: CreateSoiAdminInput,
  ): Promise<SoiAdmin> {
    return this.soiAdminService.createSoiAdmin(createSoiAdminInput);
  }
}
