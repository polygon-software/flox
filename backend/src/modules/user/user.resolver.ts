import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GetUserArgs } from './dto/args/get-user.args';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { DisableUserInput } from './dto/input/disable-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @AdminOnly()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<User[]> {
    return this.usersService.getUsers(getUsersArgs);
  }

  @AdminOnly()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @AdminOnly()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.usersService.getUser(getUserArgs);
  }

  @AnyRole()
  @Query(() => User, { name: 'getMyUser' })
  async getMyUser(@CurrentUser() user: Record<string, string>): Promise<User> {
    if (!user) {
      throw new Error('No User authenticated');
    }
    return this.usersService.getUser({ uuid: user.userId });
  }

  /**
   * Disables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => User)
  async disableUser(
    @Args('disableUserInput') disableUserInput: DisableUserInput,
  ): Promise<User> {
    return this.usersService.disableUser(disableUserInput);
  }
}
