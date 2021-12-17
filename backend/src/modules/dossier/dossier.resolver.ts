import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Dossier } from './entity/dossier.entity';
import { Public } from '../../auth/authentication.decorator';
import { DossierService } from './dossier.service';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { CreateDossierInput } from './dto/input/create-dossier.input';

@Resolver(() => Dossier)
export class DossierResolver {
  constructor(private readonly dossierService: DossierService) {}

  /**
   * Adds a new dossier to the database
   * @param {CreateDossierInput} createDossierInput - data of the new dossier
   * @returns {Promise<Dossier>} - the Dossier
   */
  @Public()
  @Mutation(() => Dossier)
  async createDossier(
    @Args('createDossierInput') createDossierInput: CreateDossierInput,
  ): Promise<Dossier> {
    return this.dossierService.createDossier(createDossierInput);
  }
  /**
   * Updates the status of a dossier
   * @param {UpdateDossierInput} updateDossierInput - input, containing new status
   * @returns {Promise<Dossier[]>} - updated status
   */
  @Public()
  @Mutation(() => Dossier)
  async updateDossier(
    @Args('UpdateDossierInput') updateDossierInput: UpdateDossierInput,
  ): Promise<Dossier> {
    return this.dossierService.updateDossier(updateDossierInput);
  }
}
