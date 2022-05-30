import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import { Public } from './authentication.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  /**
   * Gets a set of users by UUID
   * @param {GetUsersArgs} getUsersArgs - contains UUIDs of users
   * @returns {Promise<User[]>} - the users
   */
  @Public()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<User[]> {
    return this.usersService.getUsers(getUsersArgs);
  }

  /**
   * Gets all users
   * @returns {Promise<User[]>} - the users
   */
  @Public()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  /**
   * Gets a user by UUID
   * @param {GetUserArgs} getUserArgs - contains UUID
   * @returns {Promise<User>} - the user
   */
  @Public()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.usersService.getUser(getUserArgs);
  }

  /**
   * Creates a User
   * @param {CreateUserInput} createUserInput - contains all user data
   * @returns {Promise<User>} - the newly created user
   */
  @Public()
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.createUser(createUserInput);
  }

  /**
   * Updates a given user
   * @param {UpdateUserInput} updateUserInput - contains UUID and any new user data
   * @returns {Promise<User>} - the updated user
   */
  @Public()
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.updateUser(updateUserInput);
  }

  /**
   * Deletes a given user
   * @param {DeleteUserInput} deleteUserInput - contains UUID
   * @returns {Promise<User>} - the deleted user
   */
  @Public()
  @Mutation(() => User)
  async deleteUser(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.usersService.deleteUser(deleteUserInput);
  }
}
