import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Company } from './entities/company.entity';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { Public } from '../auth/authentication.decorator';
import { AdminOnly, AnyRole } from '../auth/authorization.decorator';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Gets a list of companies matching the given criteria
   * @param {GetCompaniesArgs} getCompaniesArgs - search filter (uuids)
   */
  @AdminOnly()
  @Query(() => [Company], { name: 'companies' })
  async getCompanies(
    @Args() getCompaniesArgs: GetCompaniesArgs,
  ): Promise<Company[]> {
    return await this.companyService.getCompanies(getCompaniesArgs);
  }

  /**
   * Gets all companies within the database
   */
  //@AdminOnly() TODO enable once roles are implemented in User DB
  @AnyRole()
  @Query(() => [Company], { name: 'allCompanies' })
  async getAllCompanies(): Promise<Company[]> {
    return await this.companyService.getAllCompanies();
  }

  /**
   * Gets a company from the database
   * @param {GetCompanyArgs} getCompanyArgs - getting arguments (containing either uuid or cognito_id)
   */
  @Public() // TODO restrict to appropriate roles
  @Query(() => Company, { name: 'company' })
  async getCompany(@Args() getCompanyArgs: GetCompanyArgs): Promise<Company> {
    return await this.companyService.getCompany(getCompanyArgs);
  }

  /**
   * Adds a new company to the database - will not have a cognito_id by default!
   * @param {CreateCompanyInput} createCompanyInput - data of the new company
   */
  @Public()
  @Mutation(() => Company)
  async createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    return this.companyService.createCompany(createCompanyInput);
  }

  /**
   * Updates a company's data
   * @param {UpdateCompanyInput} updateCompanyInput - company data to change
   */
  @AnyRole() // TODO restrict to appropriate roles
  @Mutation(() => Company)
  async updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    return await this.companyService.updateCompany(updateCompanyInput);
  }

  /**
   * Enables document upload for a given company
   * @param {string} uuid - the company's UUID
   */
  @AdminOnly()
  @Mutation(() => Company)
  async enableCompanyDocumentUpload(
    @Args('uuid') uuid: string,
  ): Promise<Company> {
    return await this.companyService.enableDocumentUpload(uuid);
  }

  /**
   * Removes a company
   * @param {DeleteCompanyInput} deleteCompanyInput
   */
  @Public() // TODO restrict to appropriate roles
  @Mutation(() => Company)
  async removeCompany(
    @Args('deleteCompanyInput') deleteCompanyInput: DeleteCompanyInput,
  ): Promise<Company> {
    return await this.companyService.deleteCompany(deleteCompanyInput);
  }
}
