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

  async create(createCompanyInput: CreateCompanyInput): Promise<Company> {
    const company = await this.companyRepository.create(createCompanyInput);
    return this.companyRepository.save(company);
  }

  getCompanies(getCompaniesArgs: GetCompaniesArgs): Promise<Company[]> {
    if (getCompaniesArgs.uuids !== undefined) {
      return this.companyRepository.findByIds(getCompaniesArgs.uuids);
    } else {
      return this.companyRepository.find();
    }
  }

  getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  getCompany(getCompanyArgs: GetCompanyArgs): Promise<Company> {
    return this.companyRepository.findOne(getCompanyArgs.uuid);
  }

  async update(updateCompanyInput: UpdateCompanyInput): Promise<Company> {
    const company = await this.companyRepository.create(updateCompanyInput);
    await this.companyRepository.update(updateCompanyInput.uuid, company);
    return this.companyRepository.findOne(updateCompanyInput.uuid);
  }

  async remove(deleteCompanyInput: DeleteCompanyInput): Promise<Company> {
    const company = await this.companyRepository.findOne(
      deleteCompanyInput.uuid,
    );
    const uuid = company.uuid;
    const deleted_company = await this.companyRepository.remove(company);
    deleted_company.uuid = uuid;
    return deleted_company;
  }
}
