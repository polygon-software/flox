import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { User } from './entities/company.entity';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { PubSub } from 'graphql-subscriptions';
import { Public } from '../auth/auth.guard';

// Publish/subscribe handler TODO make global and inject/provide, according to https://docs.nestjs.com/graphql/subscriptions
const pubSub = new PubSub();

@Resolver(() => User)
export class CompanyResolver {
  constructor(private readonly usersService: CompanyService) {}

  @Public()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetCompaniesArgs): Promise<User[]> {
    return await this.usersService.getUsers(getUsersArgs);
  }

  @Public()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Public()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetCompanyArgs): Promise<User> {
    return await this.usersService.getUser(getUserArgs);
  }

  @Public()
  @Mutation(() => User)
  async create(
    @Args('createUserInput') createUserInput: CreateCompanyInput,
  ): Promise<User> {
    const newUser = await this.usersService.create(createUserInput);
    // Publish authentication so subscriptions will auto-update
    await pubSub.publish('userAdded', { userAdded: newUser });
    return newUser;
  }

  @Public()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateCompanyInput,
  ): Promise<User> {
    return await this.usersService.update(updateUserInput);
  }

  @Public()
  @Mutation(() => User)
  async remove(
    @Args('deleteUserInput') deleteUserInput: DeleteCompanyInput,
  ): Promise<User> {
    return await this.usersService.remove(deleteUserInput);
  }

  @Public()
  @Subscription(() => User)
  userAdded(): AsyncIterator<unknown, any, undefined> {
    return pubSub.asyncIterator('userAdded');
  }
}
