/* eslint-disable sonarjs/no-duplicate-string */

import { Inject, Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { DOSSIER_STATUS, OFFER_STATUS, ROLE } from '../../ENUM/ENUMS';
import { UpdateDossierStatusInput } from './dto/input/update-dossier-status.input';
import { BankService } from '../bank/bank.service';
import { generateHumanReadableId } from '../../helpers';
import { EmployeeService } from '../employee/employee.service';
import { CreateOfferInput } from './dto/input/create-offer.input';
import { Offer } from '../offer/entities/offer.entity';
import { ResetDossierInput } from './dto/input/reset-dossier.input';
import { UpdateOfferStatusInput } from './dto/input/update-offer-status.input';
import { SendDossierDocumentInput } from './dto/input/send-dossier-document.input';
import { sendDossierDocumentEmail } from '../../email/helper';
import { GetPrivateFileArgs } from '../file/dto/get-private-file.args';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { ERRORS } from '../../error/ERRORS';
import { User } from '../user/entities/user.entity';
import { RemoveDossierFilesInput } from './dto/input/remove-files-dossier.input';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { prettify } from '../../helpers/log-helper';
import { isCompleted } from './dossier-helpers';
import { DeleteDossierInput } from './dto/input/delete-dossier.input';

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier)
    private readonly dossierRepository: Repository<Dossier>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly employeeService: EmployeeService,
    private readonly bankService: BankService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Creates a new dossier using the given data, and sets default values
   * @param {CreateDossierInput} createDossierInput - the dossier's data, containing all mandatory fields
   * @param {string} cognitoId - uuid of user
   * @returns {Promise<Dossier>} - dossier
   */
  async createDossier(
    createDossierInput: CreateDossierInput,
    cognitoId: string,
  ): Promise<Dossier> {
    const dbUser = await this.userService.getUser({ uuid: cognitoId });
    if (!dbUser) {
      throw new Error('No valid employee found');
    }
    const employee = await this.employeeService.getEmployee(dbUser.fk);

    let originalBank = await this.bankService.findBankByAbbreviation(
      createDossierInput.original_bank_abbreviation,
    );
    if (!originalBank) {
      originalBank = await this.bankService.createUserlessBank({
        name: createDossierInput.original_bank_name,
        abbreviation: createDossierInput.original_bank_abbreviation,
      });
    }
    const dossier = this.dossierRepository.create({
      // Basic information
      first_name: createDossierInput.first_name,
      last_name: createDossierInput.last_name,
      address: createDossierInput.address,
      email: createDossierInput.email,
      phone: createDossierInput.phone,
      birthdate: createDossierInput.birthdate,

      // Value/purchase information
      original_bank: originalBank,
      property_type: createDossierInput.property_type,
      owner_occupied: createDossierInput.owner_occupied,
      purchase_date: createDossierInput.purchase_date,
      purchase_price: createDossierInput.purchase_price,
      mortgage_amount: createDossierInput.mortgage_amount,

      // Amortisation information
      has_amortisation: createDossierInput.has_amortisation,
      direct_amortisation: createDossierInput.direct_amortisation,
      amortisation_amount: createDossierInput.amortisation_amount,

      // Building lease information
      has_building_lease: createDossierInput.has_building_lease,
      public_landlord: createDossierInput.public_landlord,
      building_lease_expiration_date:
        createDossierInput.building_lease_expiration_date,
      building_lease_interest: createDossierInput.building_lease_interest,

      // Renovation information
      has_renovation: createDossierInput.has_renovation,
      renovation_year: createDossierInput.renovation_year,
      renovation_price: createDossierInput.renovation_price,

      // Income/cost information
      incomes: createDossierInput.incomes,
      child_allowances: createDossierInput.child_allowances,
      bonus: createDossierInput.bonus,
      assets: createDossierInput.assets,
      leasing: createDossierInput.leasing,
      credit: createDossierInput.credit,
      alimony: createDossierInput.alimony,
      various: createDossierInput.various,
      prosecutions: createDossierInput.prosecutions,
      loss_certificates: createDossierInput.loss_certificates,

      // Mortgage partitions
      partition_amounts: createDossierInput.partition_amounts,
      partition_dates: createDossierInput.partition_dates,

      // Flag for non-arrangeable dossiers
      non_arrangeable: createDossierInput.non_arrangeable,

      // Calculated values
      affordability: createDossierInput.affordability,
      eligible_income: createDossierInput.eligible_income,
      total_costs: createDossierInput.total_costs,
      value_estimate_customer: createDossierInput.value_estimate_customer,
      value_estimate_calculated: createDossierInput.value_estimate_calculated,
      enfeoffment_estimate_customer:
        createDossierInput.enfeoffment_estimate_customer,
      enfeoffment_estimate_calculated:
        createDossierInput.enfeoffment_estimate_calculated,

      // Prefilled field (not from input)
      offers: [],
      documents: [],
      status: DOSSIER_STATUS.OPEN,
      readable_id: generateHumanReadableId(),
      employee: employee,
    });
    this.logger.warn(
      `Dossier created by ${prettify(dbUser)}:\n${prettify(dossier)}`,
    );
    return this.dossierRepository.save(dossier);
  }

  /**
   * Updates a dossier using the given data
   * @param {UpdateDossierInput} updateDossierInput - the dossier's data, containing all mandatory fields
   * @returns {Promise<Dossier>} - dossier
   */
  async updateDossier(
    updateDossierInput: UpdateDossierInput,
  ): Promise<Dossier> {
    await this.dossierRepository.findOneOrFail(updateDossierInput.uuid);
    await this.dossierRepository.update(
      updateDossierInput.uuid,
      updateDossierInput,
    );
    return this.dossierRepository.findOne(updateDossierInput.uuid);
  }

  /**
   * Updates a dossier to the given status
   * @param {UpdateDossierStatusInput} updateDossierStatusInput - the dossier's data, containing the new status
   * @returns {Promise<Dossier>} - dossier
   */
  async updateDossierStatus(
    updateDossierStatusInput: UpdateDossierStatusInput,
  ): Promise<Dossier> {
    await this.dossierRepository.update(updateDossierStatusInput.uuid, {
      status: updateDossierStatusInput.status,
    });
    return this.dossierRepository.findOne(updateDossierStatusInput.uuid);
  }

  /**
   * Gets the dossiers for a given employee
   * @param {string} uuid - employee's database UUID
   * @returns {Promise<Dossier[]>} - dossiers of employee
   */
  async getDossiersForEmployee(uuid: string): Promise<Dossier[]> {
    const employee = await this.employeeService.getEmployee(uuid);
    return this.dossierRepository.findByIds(
      employee.dossiers.map((dossier) => dossier.uuid),
      {
        relations: [
          'documents',
          'offers',
          'offers.bank',
          'original_bank',
          'final_document',
        ],
      },
    );
  }

  /**
   * Creates a new offer
   * @param {CreateOfferInput} createOfferInput - fields needed for a new offer
   * @returns {Promise<Dossier>} - updated dossier
   */
  async createOffer(createOfferInput: CreateOfferInput): Promise<Dossier> {
    const dossier = await this.dossierRepository.findOne(
      createOfferInput.dossier_uuid,
    );
    const bank = await this.bankService.findBank(createOfferInput.bank_uuid);
    if (!dossier || !bank) {
      throw new Error('Bank or dossier could not be found');
    }
    const newOffer = this.offerRepository.create({
      dossier,
      bank,
      status: OFFER_STATUS.INTERESTED,
      documents: [],
    });
    const savedOffer = await this.offerRepository.save(newOffer);
    const updatedDossier = this.dossierRepository.findOne(
      createOfferInput.dossier_uuid,
      {
        relations: ['offers', 'offers.bank'],
      },
    );
    this.logger.warn(
      `Offer ${prettify(savedOffer)} for dossier created:\n${prettify(
        updatedDossier,
      )}`,
    );
    return updatedDossier;
  }

  /**
   * Returns all triple-rejected dossiers
   * @returns {Promise<Dossier[]>} - dossiers
   */
  async getRejectedDossiers(): Promise<Dossier[]> {
    const allDossiers = await this.dossierRepository.find({
      relations: [
        'offers',
        'offers.bank',
        'original_bank',
        'documents',
        'final_document',
      ],
    });

    return allDossiers.filter((dossier: Dossier) => {
      const retractedOffers = dossier.offers.filter((offer: Offer) => {
        return offer.status === OFFER_STATUS.RETRACTED;
      });

      return retractedOffers.length === 3;
    });
  }

  /**
   * Resets a dossier, changing its state and deleting any open offers
   * @param {ResetDossierInput} resetDossierInput - input, containing uuid
   * @returns {Promise<Dossier>} - the dossier after being reset
   */
  async resetDossier(resetDossierInput: ResetDossierInput): Promise<Dossier> {
    // Find dossier
    const dossier = await this.dossierRepository.findOne(
      resetDossierInput.uuid,
      {
        relations: ['offers', 'original_bank'],
      },
    );

    if (!dossier) {
      throw new Error(`No dossier found for ${resetDossierInput.uuid}`);
    }

    // Remove all offers
    for (const offer of dossier.offers) {
      await this.offerRepository.remove(offer);
    }

    // Change status back to IN_PROGRESS
    await this.updateDossierStatus({
      uuid: resetDossierInput.uuid,
      status: DOSSIER_STATUS.IN_PROGRESS,
    });

    return this.dossierRepository.findOne(resetDossierInput.uuid, {
      relations: ['offers', 'original_bank'],
    });
  }

  /**
   * All dossiers, where the requesting bank isn't the original_bank and there are either open offer spots, or
   * we have already created an offer
   * @param {string} uuid - the the bank's database id ('banks' table)
   * @returns {Promise<Dossier[]>} - the dossiers
   */
  async allDossiersBank(uuid: string): Promise<Dossier[]> {
    const dossiers = await this.dossierRepository.find({
      where: {
        original_bank: {
          uuid: Not(uuid),
        },
      },

      relations: [
        'offers',
        'offers.bank',
        'offers.dossier',
        'documents',
        'final_document',
      ],
    });

    // Return only those that have less than three offers or an own offer
    return dossiers.filter((dossier) => {
      // Whether there are any open offer spots
      const freeSpots = dossier.offers.length < 3;

      // Whether we already have an offer on this dossier
      const ownOffer = !!dossier.offers.find(
        (offer) => offer.bank.uuid === uuid,
      );

      return (freeSpots && isCompleted(dossier)) || ownOffer;
    });
  }

  /**
   * Updates an offer to the given status
   * @param {UpdateOfferStatusInput} updateOfferStatusInput - contains dossier & offer UUID and new status
   * @returns {Promise<Dossier>} - updated dossier
   */
  async updateOfferStatus(
    updateOfferStatusInput: UpdateOfferStatusInput,
  ): Promise<Dossier> {
    const dossier = await this.dossierRepository.findOne(
      updateOfferStatusInput.dossier_uuid,
      {
        relations: ['offers'],
      },
    );

    // Check if dossier & offer exist and belong together
    if (
      !dossier ||
      !dossier.offers ||
      !dossier.offers.find(
        (offer) => (offer.uuid = updateOfferStatusInput.offer_uuid),
      )
    ) {
      throw new Error('Invalid updateOfferStatus input!');
    }

    // Update offer status
    if (
      updateOfferStatusInput.reject_reason &&
      updateOfferStatusInput.status === OFFER_STATUS.RETRACTED
    ) {
      await this.offerRepository.update(updateOfferStatusInput.offer_uuid, {
        status: updateOfferStatusInput.status,
        reject_reason: updateOfferStatusInput.reject_reason,
      });
    } else {
      await this.offerRepository.update(updateOfferStatusInput.offer_uuid, {
        status: updateOfferStatusInput.status,
      });
    }

    // Return updated dossier
    return this.dossierRepository.findOne(updateOfferStatusInput.dossier_uuid, {
      relations: ['offers', 'offers.bank'],
    });
  }

  /**
   * Getter for a single dossier. Currently only allows access to Employee of dossier.
   * @param {string} dossierUuid - uuid of dossier
   * @param {string} userUuid - uuid of user requesting
   * @returns {Dossier} - requested dossier
   */
  async getDossier(dossierUuid: string, userUuid: string): Promise<Dossier> {
    const user = await this.userRepository.findOne(userUuid);
    const dossier = await this.dossierRepository.findOne(dossierUuid, {
      relations: ['documents', 'employee', 'final_document'],
    });
    if (user.role === ROLE.EMPLOYEE && dossier.employee.uuid === user.fk) {
      return dossier;
    }
    throw new Error('Not Authorized');
  }

  /**
   * Removes a list of files from a dossier. Currently only allows access to Employee of dossier.
   * @param {RemoveDossierFilesInput} removeDossierFilesInput - uuid of dossier and uuids of files
   * @param {string} userUuid - uuid of user requesting
   * @returns {Dossier} - Updated dossier
   */
  async removeFiles(
    removeDossierFilesInput: RemoveDossierFilesInput,
    userUuid: string,
  ): Promise<Dossier> {
    const user = await this.userRepository.findOne(userUuid);
    const dossier = await this.dossierRepository.findOne(
      removeDossierFilesInput.uuid,
      {
        relations: ['documents', 'employee', 'final_document'],
      },
    );
    const promises = [];
    if (dossier.employee.uuid === user.fk) {
      removeDossierFilesInput.fileUuids.forEach((fileUuid) => {
        promises.push(this.fileService.deletePrivateFile(fileUuid));
      });
      await Promise.all(promises);
      const updatedDossier = await this.dossierRepository.findOne(
        removeDossierFilesInput.uuid,
        {
          relations: ['documents', 'employee', 'final_document'],
        },
      );
      this.logger.warn(`Dossier files removed: ${updatedDossier}`);
      return updatedDossier;
    }
    throw new Error('Not Authorized');
  }

  /**
   * Sends an E-mail containing an attached document belonging to a dossier
   * @param {SendDossierDocumentInput} sendDossierDocumentInput - input, containing recipients & file
   * @param {Record<string, string>} user - the User making the request
   * @returns {Promise<void>} - done
   */
  async sendDossierDocumentEmail(
    sendDossierDocumentInput: SendDossierDocumentInput,
    user: Record<string, string>,
  ) {
    // Get database user
    const dbUser = await this.userService.getUser({ uuid: user.userId });

    // Get actual file
    const args: GetPrivateFileArgs = {
      uuid: sendDossierDocumentInput.fileUuid,
      expires: null,
    };

    const pdf = await this.fileService.getPrivateFile(args, dbUser);

    const dossierUuid = sendDossierDocumentInput.uuid;
    const recipients = sendDossierDocumentInput.recipients;
    const dossier = await this.dossierRepository.findOne(dossierUuid);

    if (!dossier) {
      throw new Error(ERRORS.no_dossier_found);
    }
    if (!pdf || !pdf.url) {
      throw new Error(ERRORS.file_missing_url);
    }

    // Send actual e-mail
    await sendDossierDocumentEmail(dossier.readable_id, recipients, pdf);

    return dossier;
  }

  /**
   * Gets all dossiers in the database
   * @returns {Promise<Dossier[]>} - dossiers
   */
  async getAllDossiers(): Promise<Dossier[]> {
    return this.dossierRepository.find({
      relations: [
        'documents',
        'offers',
        'offers.bank',
        'original_bank',
        'final_document',
      ],
    });
  }

  /**
   * Fully (hard) deletes a dossier and its offers
   * @param {DeleteDossierInput} deleteDossierInput - input, containing uuid
   * @returns {Promise<Dossier>} - the dossier after being reset
   */
  async deleteDossier(
    deleteDossierInput: DeleteDossierInput,
  ): Promise<Dossier> {
    // Find dossier
    const dossier = await this.dossierRepository.findOne(
      deleteDossierInput.uuid,
      {
        relations: ['offers', 'original_bank'],
      },
    );

    if (!dossier) {
      throw new Error(`No dossier found for ${deleteDossierInput.uuid}`);
    }

    // Remove all offers
    for (const offer of dossier.offers) {
      await this.offerRepository.remove(offer);
    }

    // Delete dossier itself
    const deletedDossier = await this.dossierRepository.remove(dossier);
    deletedDossier.uuid = deleteDossierInput.uuid;

    return deletedDossier;
  }
}
