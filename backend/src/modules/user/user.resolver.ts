import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { Public } from '../../auth/authentication.decorator';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { TempDisableUserInput } from './dto/input/temp-disable-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @AdminOnly()
  @Query(() => [User], { name: 'allPlayers' })
  async getAllPlayers(): Promise<User[]> {
    return this.usersService.getAllPlayers();
  }

  @AdminOnly()
  @Query(() => [User], { name: 'allPartners' })
  async getAllPartners(): Promise<User[]> {
    return this.usersService.getAllPartners();
  }

  @AdminOnly()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.usersService.getUserWithDocuments(getUserArgs);
  }

  /**
   * Enables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => User)
  async enableUser(@Args('uuid') uuid: string): Promise<User> {
    return this.usersService.enableUser(uuid);
  }

  /**
   * Disables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => User)
  async disableUser(@Args('uuid') uuid: string): Promise<User> {
    return this.usersService.disableUser(uuid);
  }

  /**
   * Temporarily disables a given user's account
   * @param {TempDisableUserInput} tempDisableUserInput - disable input, containing UUID and end date
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => User)
  async temporarilyDisableUser(
    @Args('tempDisableUserInput') tempDisableUserInput: TempDisableUserInput,
  ): Promise<User> {
    return this.usersService.temporarilyDisableUser(tempDisableUserInput);
  }

  @Public()
  @Mutation(() => User)
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @AdminOnly()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(updateUserInput);
  }

  @AdminOnly()
  @Mutation(() => User)
  async remove(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.usersService.remove(deleteUserInput);
  }

  /**
   * Get the DB user for the currently logged in cognito user
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @async
   * @returns {User} - the user, if any
   */
  @AnyRole()
  @Query(() => User, { name: 'myUser' })
  async myUser(@CurrentUser() user: Record<string, string>): Promise<User> {
    // Get user where user's UUID matches cognitoID
    const myUser = await this.usersService.getUser({
      uuid: user.userId,
    } as GetUserArgs);

    if (!myUser) {
      throw new Error(`No user found for ${user.userId}`);
    }

    return myUser;
  }
}
