import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dossier } from './entity/dossier.entity';
import { DossierService } from './dossier.service';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierStatusInput } from './dto/input/update-dossier-status.input';
import { ROLE } from '../../ENUM/ENUMS';
import {
  AdminOnly,
  BankOnly,
  CurrentUser,
  EmployeeOnly,
  Roles,
} from '../../auth/authorization.decorator';
import { CreateOfferInput } from './dto/input/create-offer.input';
import { ResetDossierInput } from './dto/input/reset-dossier.input';
import { UpdateOfferStatusInput } from './dto/input/update-offer-status.input';
import { SendDossierDocumentInput } from './dto/input/send-dossier-document.input';
import { GetDossierInput } from './dto/input/get-dossier.input';
import { RemoveDossierFilesInput } from './dto/input/remove-files-dossier.input';
import { BankService } from '../bank/bank.service';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { GetBankArgs } from '../bank/dto/args/get-bank.args';
import { DeleteDossierInput } from './dto/input/delete-dossier.input';
import { isCompleted } from './dossier-helpers';
import { IsDossierCompleteInput } from './dto/input/is-dossier-complete.input';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => Dossier)
export class DossierResolver {
  constructor(
    private readonly dossierService: DossierService,
    private readonly bankService: BankService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

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
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier[]>} - the updated dossier
   */
  @EmployeeOnly()
  @Mutation(() => Dossier)
  async updateDossier(
    @Args('updateDossierInput') updateDossierInput: UpdateDossierInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier> {
    const dbUser = await this.userService.getUser({ uuid: user.userId });
    const dossier = await this.dossierService.getDossier(
      updateDossierInput.uuid,
      dbUser.uuid,
    );

    if (dossier.employee.uuid !== dbUser.fk) {
      throw new UnauthorizedException();
    }

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
   * @param {string} employeeUuid - employee uuid override for company access
   * @returns {Promise<Dossier[]>} - dossiers of currently logged in employee
   */
  @Roles(ROLE.COMPANY, ROLE.EMPLOYEE)
  @Query(() => [Dossier], { nullable: true, name: 'getMyDossiers' })
  async myDossiers(
    @CurrentUser() user: Record<string, string>,
    @Args('employeeUuid', { nullable: true }) employeeUuid: string,
  ): Promise<Dossier[]> {
    const dbUser = await this.userService.getUser({ uuid: user.userId });

    let employee;

    // If admin/company: overwrite user with the one of the desired employee (get by FK, since UUID is only foreign key)
    if (
      dbUser &&
      employeeUuid &&
      (dbUser.role === ROLE.SOI_ADMIN || dbUser.role === ROLE.COMPANY)
    ) {
      employee = await this.employeeService.getEmployee(employeeUuid);
    } else if (!dbUser || dbUser.role !== ROLE.EMPLOYEE) {
      throw new Error('User is not an Employee');
    } else {
      // Regular case: logged in as a employee
      employee = await this.employeeService.getEmployee(dbUser.fk);
    }

    return this.dossierService.getDossiersForEmployee(employee.uuid);
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
   * Get all dossiers
   * @returns {Promise<Dossier[]>} - all dossiers
   */
  @AdminOnly()
  @Query(() => [Dossier], { nullable: true })
  async getAllDossiers(): Promise<Dossier[]> {
    return this.dossierService.getAllDossiers();
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
   * @param {string} [bankUuid] - bank UUID, only relevant for SOIAdmin to access bank dashboard view
   * @returns {Promise<Dossier[]>} - All dossiers, where the requesting bank isn't the original_bank
   */
  @BankOnly()
  @Query(() => [Dossier])
  async allDossiersBank(
    @CurrentUser() user: Record<string, string>,
    @Args('bankUuid', { nullable: true }) bankUuid?: string,
  ): Promise<Dossier[]> {
    const dbUser = await this.userService.getUser({ uuid: user.userId });

    let bank;

    // If admin: overwrite user with the one of the desired bank (get by FK, since UUID is only foreign key)
    if (dbUser && dbUser.role === ROLE.SOI_ADMIN && bankUuid) {
      bank = await this.bankService.getBank({ uuid: bankUuid } as GetBankArgs);
    } else if (!dbUser || dbUser.role !== ROLE.BANK) {
      throw new Error('User is not a Bank');
    } else {
      // Regular case: logged in as a bank
      bank = await this.bankService.getBank({ uuid: dbUser.fk } as GetBankArgs);
    }

    return this.dossierService.allDossiersBank(bank.uuid);
  }

  /**
   * Updates the status of an offer
   * @param {UpdateOfferStatusInput} updateOfferStatusInput - input, containing dossier & offer uuid and new status (and rejection reason, if applicable)
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
   * Get a Dossier based on its Uuid
   * @param {GetDossierInput} getDossierInput - uuid of dossier
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier>} - dossier
   */
  @EmployeeOnly()
  @Query(() => Dossier)
  async getDossier(
    @Args('getDossierInput')
    getDossierInput: GetDossierInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier> {
    return this.dossierService.getDossier(getDossierInput.uuid, user.userId);
  }

  /**
   * Remove files from a dossier
   * @param {RemoveDossierFilesInput} removeDossierFilesInput - dossier uuid and file uuid list
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<Dossier>} - dossier
   */
  @EmployeeOnly()
  @Mutation(() => Dossier)
  async removeDossierFiles(
    @Args('removeDossierFilesInput')
    removeDossierFilesInput: RemoveDossierFilesInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Dossier> {
    return this.dossierService.removeFiles(
      removeDossierFilesInput,
      user.userId,
    );
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

  /**
   * Fully (hard) deletes a dossier and its offers
   * @param {DeleteDossierInput} deleteDossierInput - input, containing UUID
   * @returns {Promise<Dossier>} - the Dossier
   */
  @AdminOnly()
  @Mutation(() => Dossier)
  async deleteDossier(
    @Args('deleteDossierInput') deleteDossierInput: DeleteDossierInput,
  ): Promise<Dossier> {
    return this.dossierService.deleteDossier(deleteDossierInput);
  }

  /**
   * Determines whether a dossier is completed (all mandatory files uploaded)
   * @param {IsDossierCompleteInput} isDossierCompleteInput - input, containing dossier UUID
   * @param {Record<string, string>} user - current user
   * @returns {Promise<boolean>} - whether the dossier is completed
   */
  @EmployeeOnly()
  @Query(() => Boolean)
  async isDossierComplete(
    @Args('isDossierCompleteInput')
    isDossierCompleteInput: IsDossierCompleteInput,
    @CurrentUser() user: Record<string, string>,
  ) {
    // Get database user
    const dbUser = await this.userService.getUser({ uuid: user.userId });

    const dossier = await this.dossierService.getDossier(
      isDossierCompleteInput.uuid,
      dbUser.uuid,
    );

    if (!dossier) {
      throw new UnauthorizedException();
    }

    return isCompleted(dossier);
  }
}
