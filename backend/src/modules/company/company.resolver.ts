import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Company } from './entities/company.entity';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { AssociateUserInput } from './dto/input/associate-user.input';
import {
  AdminOnly,
  CompanyOnly,
  CurrentUser,
  SOIOnly,
} from '../../auth/authorization.decorator';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Gets a list of companies matching the given criteria
   * @param {GetCompaniesArgs} getCompaniesArgs - search filter (uuids)
   * @returns {Promise<Company[]>} - companies
   */
  @SOIOnly()
  @Query(() => [Company], { name: 'companies' })
  async getCompanies(
    @Args() getCompaniesArgs: GetCompaniesArgs,
  ): Promise<Company[]> {
    return this.companyService.getCompanies(getCompaniesArgs);
  }

  /**
   * Gets all companies within the database
   * @returns {Promise<Company[]>} - companies
   */
  @SOIOnly()
  @Query(() => [Company], { name: 'allCompanies' })
  async getAllCompanies(): Promise<Company[]> {
    return this.companyService.getAllCompanies();
  }

  /**
   * Gets a company from the database
   * @param {GetCompanyArgs} getCompanyArgs - getting arguments (containing either uuid or cognito_id)
   * @returns {Promise<Company>} - company
   */
  @SOIOnly()
  @Query(() => Company, { name: 'company' })
  async getCompany(@Args() getCompanyArgs: GetCompanyArgs): Promise<Company> {
    return this.companyService.getCompany(getCompanyArgs);
  }

  /**
   * Get the company for the currently logged in company account
   * @param {Record<string, string>} user - the current request's user
   * @returns {void}
   */
  @CompanyOnly()
  @Query(() => Company, { name: 'myCompany' })
  async getMyCompany(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Company> {
    // Get company where user's UUID matches cognitoID
    const company = await this.companyService.getCompany({
      cognito_id: user.userId,
    } as GetCompanyArgs);

    if (!company) {
      throw new Error(`No company found for ${user.userId}`);
    }

    return company;
  }
  /**
   * Adds a new company to the database - will not have a cognito_id by default!
   * @param {CreateCompanyInput} createCompanyInput - data of the new company
   * @returns {Promise<Company>} - company
   */
  @SOIOnly()
  @Mutation(() => Company)
  async createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    return this.companyService.createCompany(createCompanyInput);
  }

  /**
   * Updates a company's data
   * @param {UpdateCompanyInput} updateCompanyInput - company data to change
   * @returns {Promise<Company>} - company
   */
  @SOIOnly()
  @Mutation(() => Company)
  async updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    return this.companyService.updateCompany(updateCompanyInput);
  }

  /**
   * Enables document upload for a given company
   * @param {string} uuid - the company's UUID
   * @returns {Promise<Company>} - company
   */
  @SOIOnly()
  @Mutation(() => Company)
  async enableCompanyDocumentUpload(
    @Args('uuid') uuid: string,
  ): Promise<Company> {
    return this.companyService.enableDocumentUpload(uuid);
  }

  /**
   * Removes a company
   * @param {DeleteCompanyInput} deleteCompanyInput - company uuid
   * @returns {Promise<Company>} - company
   */
  @SOIOnly()
  @Mutation(() => Company)
  async removeCompany(
    @Args('deleteCompanyInput') deleteCompanyInput: DeleteCompanyInput,
  ): Promise<Company> {
    return this.companyService.deleteCompany(deleteCompanyInput);
  }

  /**
   * Associate User and Cognito accout
   * @param {AssociateUserInput} associateUserInput - company uuid
   * @returns {Promise<Company>} - company
   */
  @SOIOnly()
  @Mutation(() => Company)
  async associateUserToCompany(
    @Args('associateUserInput') associateUserInput: AssociateUserInput,
  ): Promise<Company> {
    return this.companyService.associateUser(associateUserInput.uuid);
  }
}
