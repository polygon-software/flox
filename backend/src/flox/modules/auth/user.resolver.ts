import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import GetAllArgs from '../abstracts/crud/dto/get-all.args';
import GetMultipleArgs from '../abstracts/crud/dto/get-multiple.args';
import DeleteInput from '../abstracts/crud/inputs/delete.input';
import AbstractSearchResolver from '../abstracts/search/abstract-search.resolver';
import SearchArgs from '../abstracts/search/dto/args/search.args';
import { CurrentUser } from '../roles/authorization.decorator';

import GetUserArgs from './dto/args/get-user.args';
import CreateUserInput from './dto/input/create-user.input';
import UpdateUserInput from './dto/input/update-user.input';
import User from './entities/user.entity';
import UserSearchOutput from './output/user-search.output';
import { LoggedIn, Public } from './authentication.decorator';
import UserService from './user.service';

@Resolver(() => User)
export default class UserResolver extends AbstractSearchResolver<
  User,
  UserService
> {
  constructor(private readonly userService: UserService) {
    super(['username', 'email', 'role']);
  }

  /**
   * @returns user service
   */
  get service(): UserService {
    return this.userService;
  }

  /**
   * Get the DB user for the currently logged in Cognito user
   *
   * @param user - currently logged-in user from request
   * @returns the user, if any
   */
  @LoggedIn()
  @Query(() => User, { name: 'MyUser' })
  async myUser(@CurrentUser() user: User): Promise<User> {
    // Get user where user's UUID matches Cognito ID
    return this.userService.getMyUser(user);
  }

  /**
   * Gets a user by UUID
   *
   * @param getUserArgs - contains UUID
   * @returns the user
   */
  @Public()
  @Query(() => User, { name: 'User' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.userService.getUser(getUserArgs);
  }

  /**
   * Gets a set of users by UUID
   *
   * @param getMultiple - contains UUIDs of users
   * @returns the users
   */
  @Public()
  @Query(() => [User], { name: 'Users' })
  async getMultipleUsers(
    @Args() getMultiple: GetMultipleArgs,
  ): Promise<User[]> {
    return super.getMultiple(getMultiple);
  }

  /**
   * Gets all users
   *
   * @param getAll - contains take and skip
   * @returns the users
   */
  @Public()
  @Query(() => [User], { name: 'AllUsers' })
  async getAllUsers(@Args() getAll: GetAllArgs): Promise<User[]> {
    return super.getAll(getAll);
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   *
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  @Public()
  @Query(() => UserSearchOutput, { name: 'SearchUsers' })
  searchUsers(@Args() queryArgs: SearchArgs): Promise<UserSearchOutput> {
    return super.search(queryArgs);
  }

  /**
   * Creates a User
   *
   * @param createUserInput - contains all user data
   * @returns the newly created user
   */
  @Public()
  @Mutation(() => User, { name: 'CreateUser' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return super.create(createUserInput);
  }

  /**
   * Updates a given user
   *
   * @param updateUserInput - contains UUID and any new user data
   * @returns the updated user
   */
  @Public()
  @Mutation(() => User, { name: 'UpdateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return super.update(updateUserInput);
  }

  /**
   * Deletes a given user
   *
   * @param deleteInput - contains UUID
   * @returns the deleted user
   */
  @Public()
  @Mutation(() => User, { name: 'DeleteUser' })
  async deleteUser(
    @Args('deleteUserInput') deleteInput: DeleteInput,
  ): Promise<User> {
    return super.delete(deleteInput);
  }
}
