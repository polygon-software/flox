import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Dossier } from './entity/dossier.entity';
import { Public } from '../../auth/authentication.decorator';
import {DossierService} from "./dossier.service";
import {UpdateDossierStatusInput} from "./dto/input/update-dossier-status.input";
import {CreateDossierInput} from "./dto/input/create-dossier.input";

@Resolver(() => Dossier)
export class DossierResolver {
  constructor(private readonly dossierService: DossierService) {}

  /**
   * Adds a new dossier to the database
   * @param {CreateDossierInput} createDossierInput - data of the new dossier
   * @returns {Promise<Dossier>} - dossier
   */
  @Public()
  @Mutation(() => Dossier)
  async createDossier(
    @Args('createDossierInput') createDossierInput: CreateDossierInput,
  ): Promise<Dossier> {
    return await this.dossierService.createDossier(createDossierInput);
  }
  /**
   * updates the status of a dossier
   * @param updateDossierStatusInput
   * @returns {Promise<Dossier[]>} - updated status
   */
  @Public()
  @Mutation(() => Dossier)
  async updateDossierStatus(
    @Args('UpdateDossierStatusInput') updateDossierStatusInput: UpdateDossierStatusInput,
  ): Promise<Dossier> {
    return await this.dossierService.updateDossier(updateDossierStatusInput);
  }
}
