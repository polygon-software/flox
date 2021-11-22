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
      // TODO: other default values
    });

    return this.companyRepository.save(company);
  }

  /**
   * Gets a list of companies by UUIDs
   * @param {GetCompaniesArgs} getCompaniesArgs - the arguments, containing a list of uuids
   */
  getCompanies(getCompaniesArgs: GetCompaniesArgs): Promise<Company[]> {
    if (getCompaniesArgs.uuids !== undefined) {
      return this.companyRepository.findByIds(getCompaniesArgs.uuids);
    } else {
      return this.companyRepository.find();
    }
  }

  /**
   * Returns all companies in the database
   */
  getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  /**
   * Returns a single company
   * @param {GetCompanyArgs} getCompanyArgs - the arguments to get a company for, containing a UUID
   */
  getCompany(getCompanyArgs: GetCompanyArgs): Promise<Company> {
    return this.companyRepository.findOne(getCompanyArgs.uuid);
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
    const deleted_company = await this.companyRepository.remove(company);
    deleted_company.uuid = uuid;
    return deleted_company;
  }
}
