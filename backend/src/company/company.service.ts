import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  /**
   * Creates a new company using the given data, and sets default values
   * @param {CreateCompanyInput} createCompanyInput - the company's data, containing all mandatory fields
   */
  async createCompany(
    createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    const company = this.companyRepository.create({
      ...createCompanyInput,
      document_upload_enabled: false, // initially disable document upload until manually enabled by SOI admin
      cognito_id: null,
      // TODO: other default values
    });

    return this.companyRepository.save(company);
  }

  /**
   * Gets a list of companies by UUIDs
   * @param {GetCompaniesArgs} getCompaniesArgs - the arguments, containing a list of uuids
   */
  async getCompanies(getCompaniesArgs: GetCompaniesArgs): Promise<Company[]> {
    if (getCompaniesArgs.uuids !== undefined) {
      return this.companyRepository.findByIds(getCompaniesArgs.uuids);
    } else {
      return this.companyRepository.find();
    }
  }

  /**
   * Returns all companies in the database
   */
  async getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find();
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
      return this.companyRepository.findOne(getCompanyArgs.uuid);
    } else if (getCompanyArgs.cognito_id) {
      // Case 2: search by Cognito account ID
      return this.companyRepository.findOne({
        cognito_id: getCompanyArgs.cognito_id,
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
    const company = this.companyRepository.create(updateCompanyInput);
    await this.companyRepository.update(updateCompanyInput.uuid, company);
    return this.companyRepository.findOne(updateCompanyInput.uuid);
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
    const company = await this.companyRepository.findOne(uuid);
    company.document_upload_enabled = true;
    await this.companyRepository.update(uuid, company);
    return this.companyRepository.findOne(uuid);
  }
}
