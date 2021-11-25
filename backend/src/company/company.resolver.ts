import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Company } from './entities/company.entity';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { Public } from '../auth/auth.guard';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Public() // TODO restrict to SOI role only
  @Query(() => [Company], { name: 'companies' })
  async getCompanies(
    @Args() getCompaniesArgs: GetCompaniesArgs,
  ): Promise<Company[]> {
    return await this.companyService.getCompanies(getCompaniesArgs);
  }

  @Public() // TODO restrict to SOI role only
  @Query(() => [Company], { name: 'allCompanies' })
  async getAllCompanies(): Promise<Company[]> {
    return await this.companyService.getAllCompanies();
  }

  @Public() // TODO restrict to SOI role only
  @Query(() => Company, { name: 'company' })
  async getCompany(@Args() getCompanyArgs: GetCompanyArgs): Promise<Company> {
    return await this.companyService.getCompany(getCompanyArgs);
  }

  @Public()
  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    return this.companyService.createCompany(createCompanyInput);
  }

  @Public() // TODO restrict to appropriate roles
  @Mutation(() => Company)
  async updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    return await this.companyService.updateCompany(updateCompanyInput);
  }

  @Public() // TODO restrict to SOI admin
  @Mutation(() => Company)
  async enableCompanyDocumentUpload(
    @Args('uuid') uuid: string,
  ): Promise<Company> {
    return await this.companyService.enableDocumentUpload(uuid);
  }

  @Public() // TODO restrict to appropriate roles
  @Mutation(() => Company)
  async removeCompany(
    @Args('deleteCompanyInput') deleteCompanyInput: DeleteCompanyInput,
  ): Promise<Company> {
    return await this.companyService.deleteCompany(deleteCompanyInput);
  }
}
