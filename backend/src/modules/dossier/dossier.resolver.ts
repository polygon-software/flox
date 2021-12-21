import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Dossier } from './entity/dossier.entity';
import { Public } from '../../auth/authentication.decorator';
import { DossierService } from './dossier.service';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierStatusInput } from './dto/input/update-dossier-status.input';
import {
  AnyRole,
  CurrentUser,
  EmployeeOnly,
} from '../../auth/authorization.decorator';

@Resolver(() => Dossier)
export class DossierResolver {
  constructor(private readonly dossierService: DossierService) {}

  /**
   * Adds a new dossier to the database
   * @param {CreateDossierInput} createDossierInput - data of the new dossier
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier>} - the Dossier
   */
  @EmployeeOnly() //ToDo
  @Mutation(() => Dossier)
  async createDossier(
    @Args('createDossierInput') createDossierInput: CreateDossierInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier> {
    return this.dossierService.createDossier(createDossierInput, user.userId);
  }
  /**
   * Updates the anything of a dossier
   * @param {UpdateDossierInput} updateDossierInput - input, containing new status
   * @returns {Promise<Dossier[]>} - updated dossier
   */
  @AnyRole() //ToDo
  @Mutation(() => Dossier)
  async updateDossier(
    @Args('updateDossierInput') updateDossierInput: UpdateDossierInput,
  ): Promise<Dossier> {
    return this.dossierService.updateDossier(updateDossierInput);
  }

  /**
   * Updates the status of a dossier
   * @param {UpdateDossierStatusInput} updateDossierStatusInput - input, containing new status
   * @returns {Promise<Dossier[]>} - updated dossier
   */
  @AnyRole() //ToDo
  @Mutation(() => Dossier)
  async updateDossierStatus(
    @Args('updateDossierStatusInput')
    updateDossierStatusInput: UpdateDossierStatusInput,
  ): Promise<Dossier> {
    return this.dossierService.updateDossierStatus(updateDossierStatusInput);
  }

  /**
   * Todo
   */
  @AnyRole() // Todo
  @Query(() => [Dossier], { nullable: true })
  async myDossiers(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier[]> {
    return this.dossierService.myDossiers(user.userId);
  }
}
