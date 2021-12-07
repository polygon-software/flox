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
import { ROLES } from '../../ENUM/ENUMS';
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
      document_upload_enabled: false, // initially disable document upload until manually enabled by SOI admin
      documents: null,
      // TODO: other default values
    });

    return await this.companyRepository.save(company);
  }

  /**
   * Gets a list of companies by UUIDs
   * @param {GetCompaniesArgs} getCompaniesArgs - the arguments, containing a list of uuids
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
   */
  async getAllCompanies(): Promise<Company[]> {
    return await this.companyRepository.find({ relations: ['documents'] });
  }

  /**
   * Returns a single company
   * @param {GetCompanyArgs} getCompanyArgs - the arguments to get a company for, containing a UUID
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
      if (user.role !== ROLES.COMPANY) {
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
   */
  async enableDocumentUpload(uuid: string): Promise<Company> {
    await this.companyRepository.update(uuid, {
      document_upload_enabled: true,
    });
    return await this.companyRepository.findOne(uuid);
  }

  /**
   *
   */
  async associateUser(uuid: string): Promise<Company> {
    const company = await this.companyRepository.findOne(uuid);
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(company.email, password);
    await sendPasswordChangeEmail(company.email, password, ROLES.COMPANY);
    await this.userService.create({
      role: ROLES.COMPANY,
      uuid: cognitoId,
      fk: company.uuid,
    });
    return company;
  }
}
