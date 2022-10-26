import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import { LoggedIn, Public } from './authentication.decorator';
import { CurrentUser } from '../roles/authorization.decorator';
import { AbstractSearchQueryResolver } from '../interfaces/abstract-search-query.resolver';
import { SearchQueryArgs } from '../interfaces/dto/args/search-query.args';
import { UserQueryOutput } from './output/user-query.output';

@Resolver(() => User)
export class UserResolver extends AbstractSearchQueryResolver<
  User,
  UserService
> {
  constructor(private readonly userService: UserService) {
    super('username');
  }

  get service(): UserService {
    return this.userService;
  }

  /**
   * Gets a set of users by UUID
   * @param getUsersArgs - contains UUIDs of users
   * @returns the users
   */
  @Public()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<User[]> {
    return this.userService.getUsers(getUsersArgs);
  }

  /**
   * Gets all users
   * @returns the users
   */
  @Public()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  @Public()
  @Query(() => UserQueryOutput, { name: 'queryUsers' })
  queryAll(@Args() queryArgs: SearchQueryArgs): Promise<UserQueryOutput> {
    return this.userService.queryAll(queryArgs);
  }

  /**
   * Gets a user by UUID
   * @param getUserArgs - contains UUID
   * @returns the user
   */
  @Public()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.userService.getUser(getUserArgs);
  }

  /**
   * Creates a User
   * @param createUserInput - contains all user data
   * @returns the newly created user
   */
  @Public()
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  /**
   * Updates a given user
   * @param updateUserInput - contains UUID and any new user data
   * @returns the updated user
   */
  @Public()
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(updateUserInput);
  }

  /**
   * Deletes a given user
   * @param deleteUserInput - contains UUID
   * @returns the deleted user
   */
  @Public()
  @Mutation(() => User)
  async deleteUser(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.userService.deleteUser(deleteUserInput);
  }

  /**
   * Get the DB user for the currently logged in Cognito user
   * @param user - currently logged-in user from request
   * @returns the user, if any
   */
  @LoggedIn()
  @Query(() => User, { name: 'myUser' })
  async myUser(@CurrentUser() user: User): Promise<User> {
    // Get user where user's UUID matches Cognito ID
    return this.userService.getMyUser(user);
  }
}
