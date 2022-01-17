import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dossier } from './entity/dossier.entity';
import { DossierService } from './dossier.service';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierStatusInput } from './dto/input/update-dossier-status.input';
import { ROLE } from '../../ENUM/ENUMS';
import {
  AdminOnly,
  Roles,
  BankOnly,
  CurrentUser,
  EmployeeOnly,
} from '../../auth/authorization.decorator';
import { CreateOfferInput } from './dto/input/create-offer.input';
import { ResetDossierInput } from './dto/input/reset-dossier.input';
import { UpdateOfferStatusInput } from './dto/input/update-offer-status.input';
import { SendDossierDocumentInput } from './dto/input/send-dossier-document.input';

@Resolver(() => Dossier)
export class DossierResolver {
  constructor(private readonly dossierService: DossierService) {}

  /**
   * Adds a new dossier to the database
   * @param {CreateDossierInput} createDossierInput - data of the new dossier
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier>} - the Dossier
   */
  @EmployeeOnly()
  @Mutation(() => Dossier)
  async createDossier(
    @Args('createDossierInput') createDossierInput: CreateDossierInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier> {
    return this.dossierService.createDossier(createDossierInput, user.userId);
  }

  /**
   * Updates the data of a dossier
   * @param {UpdateDossierInput} updateDossierInput - input, containing new status
   * @returns {Promise<Dossier[]>} - updated dossier
   */
  @EmployeeOnly()
  @Mutation(() => Dossier)
  async updateDossier(
    @Args('updateDossierInput') updateDossierInput: UpdateDossierInput,
  ): Promise<Dossier> {
    return this.dossierService.updateDossier(updateDossierInput);
  }

  /**
   * Updates the status of a dossier
   * @param {UpdateDossierStatusInput} updateDossierStatusInput - input, containing new status
   * @returns {Promise<Dossier>} - updated dossier
   */
  @Roles(ROLE.EMPLOYEE, ROLE.BANK, ROLE.SOI_ADMIN)
  @Mutation(() => Dossier)
  async updateDossierStatus(
    @Args('updateDossierStatusInput')
    updateDossierStatusInput: UpdateDossierStatusInput,
  ): Promise<Dossier> {
    return this.dossierService.updateDossierStatus(updateDossierStatusInput);
  }

  /**
   * Dossiers of currently logged in employee
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier[]>} - dossiers of currently logged in employee
   */
  @EmployeeOnly()
  @Query(() => [Dossier], { nullable: true, name: 'getMyDossiers' })
  async myDossiers(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier[]> {
    return this.dossierService.myDossiers(user.userId);
  }

  /**
   * Dossiers that have been rejected by three banks
   * @returns {Promise<Dossier[]>} - all rejected dossiers
   */
  @AdminOnly()
  @Query(() => [Dossier], { nullable: true })
  async getRejectedDossiers(): Promise<Dossier[]> {
    return this.dossierService.getRejectedDossiers();
  }

  /**
   * Resets a dossier, changing its state and deleting any open offers
   * @param {ResetDossierInput} resetDossierInput - input, containing uuid
   * @returns {Promise<Dossier>} - the dossier after being reset
   */
  @AdminOnly()
  @Mutation(() => Dossier)
  async resetDossier(
    @Args('resetDossierInput') resetDossierInput: ResetDossierInput,
  ): Promise<Dossier> {
    return this.dossierService.resetDossier(resetDossierInput);
  }

  /**
   * Creates an offer from a given bank to a given dossier
   * @param {CreateOfferInput} createOfferInput - the two uuids and the status
   * @returns {Dossier} - the updated dossier
   */
  @BankOnly()
  @Mutation(() => Dossier)
  async createOffer(
    @Args('createOfferInput') createOfferInput: CreateOfferInput,
  ): Promise<Dossier> {
    return this.dossierService.createOffer(createOfferInput);
  }

  /**
   * All dossiers, where the requesting bank isn't the original_bank
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier[]>} - All dossiers, where the requesting bank isn't the original_bank
   */
  @BankOnly()
  @Query(() => [Dossier])
  async allDossiersBank(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier[]> {
    return this.dossierService.allDossiersBank(user.userId);
  }

  /**
   * Updates the status of an offer
   * @param {UpdateOfferStatusInput} updateOfferStatusInput - input, containing dossier & offer uuid and new status
   * @returns {Promise<Dossier>} - updated dossier
   */
  @Roles(ROLE.EMPLOYEE, ROLE.BANK, ROLE.SOI_ADMIN)
  @Mutation(() => Dossier)
  async updateOfferStatus(
    @Args('updateOfferStatusInput')
    updateOfferStatusInput: UpdateOfferStatusInput,
  ): Promise<Dossier> {
    return this.dossierService.updateOfferStatus(updateOfferStatusInput);
  }

  /**
   * Sends an e-mail containing a dossier document to the specified recipients
   * @param {SendDossierDocumentInput} sendDossierDocumentInput - input, containing dossier UUID, recipient, & file UUID
   * @param {Record<string, string>} user - current user
   * @returns {Promise<void>} - done
   */
  @EmployeeOnly()
  @Mutation(() => Dossier)
  async sendDossierDocumentEmail(
    @Args('sendDossierDocumentInput')
    sendDossierDocumentInput: SendDossierDocumentInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier> {
    return this.dossierService.sendDossierDocumentEmail(
      sendDossierDocumentInput,
      user,
    );
  }
}
