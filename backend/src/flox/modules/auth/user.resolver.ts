import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import GetAllArgs from '../abstracts/crud/dto/args/get-all.args';
import GetMultipleArgs from '../abstracts/crud/dto/args/get-multiple.args';
import DeleteInput from '../abstracts/crud/dto/input/delete.input';
import AbstractSearchResolver from '../abstracts/search/abstract-search.resolver';
import SearchArgs from '../abstracts/search/dto/args/search.args';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import UpdateInput from '../abstracts/crud/dto/input/update.input';

import GetUserArgs from './dto/args/get-user.args';
import AdminCreateUserInput from './dto/input/admin-create-user.input';
import SignupCreateUserInput from './dto/input/signup-create-user.input';
import UpdateUserInput from './dto/input/update-user.input';
import User from './entities/user.entity';
import UserSearchOutput from './dto/output/user-search.output';
import { LoggedIn, Public } from './authentication.decorator';
import UserService from './user.service';
import { assertIsAllowedToManipulate } from './helpers/auth.helper';
import {
  deleteCognitoAccount,
  signupCreateCognitoAccount,
} from './helpers/cognito.helper';
import AdminCreateUserOutput from './dto/output/admin-create-user.output';

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
   * Get the DB user for the currently logged in user
   *
   * @param user - currently logged-in user from request
   * @returns the user, if any
   */
  @LoggedIn()
  @Query(() => User, { name: 'MyUser' })
  async myUser(@CurrentUser() user: User): Promise<User> {
    return this.getOne(user);
  }

  /**
   * Gets a user by UUID
   *
   * @param getUserArgs - contains UUID
   * @returns the user
   */
  @LoggedIn()
  @Query(() => User, { name: 'User' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.getOne(getUserArgs);
  }

  /**
   * Gets a set of users by UUID
   *
   * @param getMultiple - contains UUIDs of users
   * @returns the users
   */
  @LoggedIn()
  @Query(() => [User], { name: 'Users' })
  async getMultipleUsers(
    @Args() getMultiple: GetMultipleArgs,
  ): Promise<User[]> {
    return this.getMultiple(getMultiple);
  }

  /**
   * Gets all users
   *
   * @param getAll - contains take and skip
   * @returns the users
   */
  @AdminOnly()
  @Query(() => [User], { name: 'AllUsers' })
  async getAllUsers(@Args() getAll: GetAllArgs): Promise<User[]> {
    const users = await this.getAll(getAll);
    return this.service.setEnabledFlag(users);
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   *
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  @AdminOnly()
  @Query(() => UserSearchOutput, { name: 'SearchUsers' })
  async searchUsers(@Args() queryArgs: SearchArgs): Promise<UserSearchOutput> {
    const searchRes = await super.search(queryArgs);
    searchRes.data = await this.service.setEnabledFlag(searchRes.data);
    return searchRes;
  }

  /**
   * Returns true if the users cognito account is enabled, false otherwise.
   *
   * @param getUserArgs - object containing user uuid
   * @returns true if enabled, false otherwise
   */
  @AdminOnly()
  @Query(() => Boolean, { name: 'IsUserEnabled' })
  async isUserEnabled(@Args() getUserArgs: GetUserArgs): Promise<boolean> {
    return this.userService.isUserEnabled(getUserArgs);
  }

  /**
   * Creates a User with a corresponding Cognito account
   *
   * @param adminCreateUserInput - contains all user data
   * @returns the newly created user
   */
  @AdminOnly()
  @Mutation(() => AdminCreateUserOutput, { name: 'AdminCreateUser' })
  async adminCreateUser(
    @Args('adminCreateUserInput') adminCreateUserInput: AdminCreateUserInput,
  ): Promise<AdminCreateUserOutput> {
    const { cognitoUuid, password } =
      await this.userService.adminCreateCognitoUser(adminCreateUserInput);

    // Create & return database entry
    const newUser = await super.create({
      ...adminCreateUserInput,
      cognitoUuid,
    });

    const userOutput = { data: newUser } as AdminCreateUserOutput;

    // If no delivery mediums are selected, return the password as well
    if (adminCreateUserInput.deliveryMediums.length === 0) {
      userOutput.password = password;
    }
    return userOutput;
  }

  /**
   * Creates a User with a corresponding Cognito account
   *
   * @param signupCreateUserInput - contains all user data
   * @returns the newly created user
   */
  @Public()
  @Mutation(() => User, { name: 'SignupCreateUser' })
  async signupCreateUser(
    @Args('signupCreateUserInput') signupCreateUserInput: SignupCreateUserInput,
  ): Promise<User> {
    // Create Cognito account
    const cognitoUuid = await signupCreateCognitoAccount(
      signupCreateUserInput.username,
      signupCreateUserInput.email,
      signupCreateUserInput.password,
    );
    return super.create({
      cognitoUuid,
      ...signupCreateUserInput,
    });
  }

  /**
   * Updates a given user
   *
   * @param updateUserInput - contains UUID and any new user data
   * @param user - currently logged-in user
   * @returns the updated user
   */
  @LoggedIn()
  @Mutation(() => User, { name: 'UpdateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    assertIsAllowedToManipulate(user, updateUserInput.uuid);
    return super.update(updateUserInput);
  }

  /**
   * Deletes a given user, along with their Cognito account
   *
   * @param deleteInput - contains UUID
   * @returns the deleted user
   */
  @AdminOnly()
  @Mutation(() => User, { name: 'DeleteUser' })
  async deleteUser(
    @Args('deleteUserInput') deleteInput: DeleteInput,
  ): Promise<User> {
    // Find corresponding user
    const user = await this.userService.getUser({ uuid: deleteInput.uuid });

    // Delete cognito account
    await deleteCognitoAccount(user.username);

    // Delete in database
    return super.delete(deleteInput);
  }

  /**
   * Disables a given user's account
   *
   * @param disableInput - contains UUID
   * @returns the disabled user
   */
  @AdminOnly()
  @Mutation(() => User, { name: 'DisableUser' })
  async disableUser(
    @Args('disableUserInput') disableInput: UpdateInput,
  ): Promise<User> {
    return this.userService.disableUser(disableInput);
  }

  /**
   * Re-enables a given user's account
   *
   * @param enableInput - contains UUID
   * @returns the disabled user
   */
  @AdminOnly()
  @Mutation(() => User, { name: 'EnableUser' })
  async enableUser(
    @Args('enableUserInput') enableInput: UpdateInput,
  ): Promise<User> {
    return this.userService.enableUser(enableInput);
  }

  /**
   * Forces a user to change their password
   *
   * @param changeInput - contains UUID
   * @returns the user whose password was force-changed
   */
  @AdminOnly()
  @Mutation(() => User, { name: 'ForceUserPasswordChange' })
  async forceUserPasswordChange(
    @Args('forceUserPasswordChangeInput') changeInput: UpdateInput,
  ): Promise<User> {
    return this.userService.forceUserPasswordChange(changeInput);
  }
}
