import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { generateHumanReadableId } from '../../helpers';
import { User } from '../user/entities/user.entity';
import { CREATION_STATE, ROLE } from '../../ENUM/ENUMS';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { UserService } from '../user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  /**
   * Creates a new company using the given data, and sets default values
   * @param {CreateCompanyInput} createCompanyInput - the company's data, containing all mandatory fields
   * @returns {Promise<Company>} - company
   */
  async createCompany(
    createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    // Generate human-readable ID and search for existing company with same ID
    let readableId = generateHumanReadableId();
    let existingCompany = await this.companyRepository.findOne({
      readable_id: readableId,
    });

    // If ID already exists, regenerate
    while (existingCompany !== null && existingCompany !== undefined) {
      readableId = generateHumanReadableId();
      existingCompany = await this.companyRepository.findOne({
        readable_id: readableId,
      });
    }

    const company = this.companyRepository.create({
      ...createCompanyInput,
      readable_id: readableId,
      creation_state: CREATION_STATE.APPLIED, // initially disable document upload until manually enabled by SOI admin
      documents: null,
      // TODO: other default values
    });

    return await this.companyRepository.save(company);
  }

  /**
   * Gets a list of companies by UUIDs
   * @param {GetCompaniesArgs} getCompaniesArgs - the arguments, containing a list of uuids
   * @returns {Promise<Company[]>} - companies
   */
  async getCompanies(getCompaniesArgs: GetCompaniesArgs): Promise<Company[]> {
    if (getCompaniesArgs.uuids !== undefined) {
      return await this.companyRepository.findByIds(getCompaniesArgs.uuids);
    } else {
      return await this.companyRepository.find();
    }
  }

  /**
   * Returns all companies in the database
   * @returns {Promise<Company[]>} - company
   */
  async getAllCompanies(): Promise<Company[]> {
    return await this.companyRepository.find({ relations: ['documents'] });
  }

  /**
   * Returns a single company
   * @param {GetCompanyArgs} getCompanyArgs - the arguments to get a company for, containing a UUID
   * @returns {Promise<Company>} - company
   */
  async getCompany(getCompanyArgs: GetCompanyArgs): Promise<Company> {
    if (!getCompanyArgs.uuid && !getCompanyArgs.cognito_id) {
      throw new Error('Must specify either uuid or cognito_id on getCompany');
    }
    if (getCompanyArgs.uuid) {
      // Case 1: search by UUID
      return await this.companyRepository.findOne(getCompanyArgs.uuid);
    } else if (getCompanyArgs.cognito_id) {
      // Case 2: search by Cognito account ID
      const user = await this.userRepository.findOne({
        uuid: getCompanyArgs.cognito_id,
      });
      if (user.role !== ROLE.COMPANY) {
        throw Error('User is not a company');
      }
      return await this.companyRepository.findOne({
        uuid: user.fk,
      });
    }
  }

  /**
   * Updates any given values of a company (by UUID)
   * @param {UpdateCompanyInput} updateCompanyInput - the company update data
   * @returns {Promise<Company>} - company
   */
  async updateCompany(
    updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    await this.companyRepository.update(updateCompanyInput.uuid, {
      ...updateCompanyInput, // TODO ensure UUID is immutable
    });
    return await this.companyRepository.findOne(updateCompanyInput.uuid);
  }

  /**
   * Deletes a company by UUID
   * @param {DeleteCompanyInput} deleteCompanyInput - deletion input, containing UUID
   * @returns {Promise<Company>} - company
   */
  async deleteCompany(
    deleteCompanyInput: DeleteCompanyInput,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne(
      deleteCompanyInput.uuid,
    );
    const uuid = company.uuid;
    const deletedCompany = await this.companyRepository.remove(company);
    deletedCompany.uuid = uuid;
    return deletedCompany;
  }

  /**
   * Enables document upload for a company by UUID
   * @param {string} uuid - the company's uuid
   * @returns {Promise<Company>} - company
   */
  async enableDocumentUpload(uuid: string): Promise<Company> {
    const company = await this.companyRepository.findOne(uuid);
    if (company.creation_state !== CREATION_STATE.APPLIED) {
      throw Error(
        "Can't enable Document Upload when the current creation state isn't 'APPLIED'. Is: " +
          company.creation_state,
      );
    }
    await this.companyRepository.update(uuid, {
      creation_state: CREATION_STATE.AWAITING_DOCUMENTS,
    });
    return await this.companyRepository.findOne(uuid);
  }

  /**
   * Create a Cognito User and database user an associate them to the given company uuid
   * @param {string} uuid - The uuid of the company
   * @returns {Promise<Company>} - company
   */
  async associateUser(uuid: string): Promise<Company> {
    const company = await this.companyRepository.findOne(uuid);
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(company.email, password);
    await sendPasswordChangeEmail(company.email, password, ROLE.COMPANY);
    await this.userService.create({
      role: ROLE.COMPANY,
      uuid: cognitoId,
      fk: company.uuid,
    });
    company.creation_state = CREATION_STATE.DONE;
    await this.companyRepository.save(company);
    return this.companyRepository.findOne(uuid);
  }
}
