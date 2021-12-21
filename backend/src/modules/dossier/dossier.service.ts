import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { STATUS } from '../../ENUM/ENUMS';
import { UpdateDossierStatusInput } from './dto/input/update-dossier-status.input';
import { BankService } from '../bank/bank.service';
import { generateHumanReadableId } from '../../helpers';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier) private dossierRepository: Repository<Dossier>,
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

    let originalBank = await this.bankService.findBankByName(
      createDossierInput.original_bank_name,
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
      status: STATUS.IN_PROCESS,
      first_name: createDossierInput.first_name,
      last_name: createDossierInput.last_name,
      email: createDossierInput.email,
      readable_id: generateHumanReadableId(),
      employee: employee,
    });

    return await this.dossierRepository.save(dossier);
  }

  /**
   * Updates a dossier using with the given data
   * @param {UpdateDossierInput} updateDossierInput - the dossier's data, containing all mandatory fields
   * @returns {Promise<Dossier>} - dossier
   */
  async updateDossier(
    updateDossierInput: UpdateDossierInput,
  ): Promise<Dossier> {
    await this.dossierRepository.update(
      updateDossierInput.uuid,
      updateDossierInput,
    );
    return this.dossierRepository.findOne(updateDossierInput.uuid);
  }

  /**
   * Updates a dossier to the given status
   * @param {UpdateDossierStatusInput} updateDossierStatusInput - the dossier's data, containing all mandatory fields
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
   * @param {string} cognito_id - id of user of employee
   * @returns {Promise<Dossier[]>} - dossiers of employee
   */
  async myDossiers(cognito_id: string): Promise<Dossier[]> {
    const employee = await this.employeeService.getMyEmployee(cognito_id);
    return employee.dossiers;
  }
}
