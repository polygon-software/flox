import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Company } from './entities/company.entity';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { PubSub } from 'graphql-subscriptions';
import { Public } from '../auth/auth.guard';

// Publish/subscribe handler TODO make global and inject/provide, according to https://docs.nestjs.com/graphql/subscriptions
const pubSub = new PubSub();

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Public()
  @Query(() => [Company], { name: 'companies' })
  async getCompanys(
    @Args() getCompanysArgs: GetCompaniesArgs,
  ): Promise<Company[]> {
    return await this.companyService.getCompanies(getCompanysArgs);
  }

  @Public()
  @Query(() => [Company], { name: 'allCompanies' })
  async getAllCompanys(): Promise<Company[]> {
    return await this.companyService.getAllCompanies();
  }

  @Public()
  @Query(() => Company, { name: 'company' })
  async getCompany(@Args() getCompanyArgs: GetCompanyArgs): Promise<Company> {
    return await this.companyService.getCompany(getCompanyArgs);
  }

  @Public()
  @Mutation(() => Company)
  async create(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    const newCompany = await this.companyService.create(createCompanyInput);
    // Publish authentication so subscriptions will auto-update
    await pubSub.publish('companyAdded', { companyAdded: newCompany });
    return newCompany;
  }

  @Public()
  @Mutation(() => Company)
  async update(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    return await this.companyService.update(updateCompanyInput);
  }

  @Public()
  @Mutation(() => Company)
  async remove(
    @Args('deleteCompanyInput') deleteCompanyInput: DeleteCompanyInput,
  ): Promise<Company> {
    return await this.companyService.remove(deleteCompanyInput);
  }

  @Public()
  @Subscription(() => Company)
  companyAdded(): AsyncIterator<unknown, any, undefined> {
    return pubSub.asyncIterator('companyAdded');
  }
}
