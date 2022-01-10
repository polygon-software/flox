/* eslint-disable sonarjs/no-duplicate-string */

import { Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { DOSSIER_STATUS, OFFER_STATUS } from '../../ENUM/ENUMS';
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
import PrivateFile from '../file/entities/private_file.entity';

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier)
    private readonly dossierRepository: Repository<Dossier>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly employeeService: EmployeeService,
    private readonly bankService: BankService,
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
    const employee = await this.employeeService.getMyEmployee(cognitoId);

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
      correspondence_address: createDossierInput.correspondence_address,
      original_bank: originalBank,
      born: createDossierInput.born,
      property_address: createDossierInput.property_address,
      loan_sum: createDossierInput.loan_sum,
      non_arrangeable: false,
      offers: [],
      documents: [],
      status: DOSSIER_STATUS.IN_PROGRESS,
      first_name: createDossierInput.first_name,
      last_name: createDossierInput.last_name,
      email: createDossierInput.email,
      readable_id: generateHumanReadableId(),
      employee: employee,
    });

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
   * @param {string} cognitoId - id of user of employee
   * @returns {Promise<Dossier[]>} - dossiers of employee
   */
  async myDossiers(cognitoId: string): Promise<Dossier[]> {
    const employee = await this.employeeService.getMyEmployee(cognitoId);
    return this.dossierRepository.findByIds(
      employee.dossiers.map((dossier) => dossier.uuid),
      { relations: ['documents', 'offers', 'offers.bank', 'original_bank'] },
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
      status: createOfferInput.status,
      documents: [],
    });
    await this.offerRepository.save(newOffer);
    return this.dossierRepository.findOne(createOfferInput.dossier_uuid, {
      relations: ['offers', 'offers.bank'],
    });
  }

  /**
   * Returns all triple-rejected dossiers
   * @returns {Promise<Dossier[]>} - dossiers
   */
  async getRejectedDossiers(): Promise<Dossier[]> {
    const allDossiers = await this.dossierRepository.find({
      relations: ['offers', 'offers.bank', 'original_bank'],
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
   * @param {string} cognitoId - the the banks users id
   * @returns {Promise<Dossier[]>} - the dossiers
   */
  async allDossiersBank(cognitoId: string): Promise<Dossier[]> {
    const bank = await this.bankService.getMyBank(cognitoId);
    const dossiers = await this.dossierRepository.find({
      where: {
        original_bank: {
          uuid: Not(bank.uuid),
        },
      },
      relations: ['offers', 'offers.bank', 'documents'],
    });

    // Return only those that have less than three offers or an own offer
    return dossiers.filter((dossier) => {
      // Whether there are any open offer spots
      const freeSpots = dossier.offers.length < 3;

      // Whether we already have an offer on this dossier
      const ownOffer = !!dossier.offers.find(
        (offer) => offer.bank.uuid === bank.uuid,
      );

      return freeSpots || ownOffer;
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
    await this.offerRepository.update(updateOfferStatusInput.offer_uuid, {
      status: updateOfferStatusInput.status,
    });

    // Return updated dossier
    return this.dossierRepository.findOne(updateOfferStatusInput.dossier_uuid, {
      relations: ['offers', 'offers.bank'],
    });
  }

  /**
   * Sends an E-mail containing an attached document belonging to a dossier
   * @param {SendDossierDocumentInput} sendDossierDocumentInput - input, containing recipients & file
   * @param {PrivateFile} pdf - the PDF file to attach to the e-mail
   * @returns {Promise<void>} - done
   */
  async sendDossierDocumentEmail(
    sendDossierDocumentInput: SendDossierDocumentInput,
  ) {
    const dossierUuid = sendDossierDocumentInput.uuid;
    const recipients = sendDossierDocumentInput.recipients;
    const pdf = sendDossierDocumentInput.file;
    console.log('SEND EMAIL to dossier uuid', dossierUuid);

    const dossier = await this.dossierRepository.findOne(dossierUuid);

    if (!dossier) {
      throw new Error(`Dossier ${dossierUuid} does not exist`);
    }

    // Send actual e-mail
    await sendDossierDocumentEmail(dossier.readable_id, recipients, pdf);
  }
}
