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
import { FileService } from '../file/file.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Public()
  @Query(() => [User], { name: 'allPlayers' })
  async getAllPlayers(): Promise<User[]> {
    return this.userService.getAllPlayers();
  }

  @Public()
  @Query(() => [User], { name: 'allPartners' })
  async getAllPartners(): Promise<User[]> {
    return this.userService.getAllPartners();
  }

  @Public()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.userService.getUser(getUserArgs);
  }

  /**
   * Enables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => User)
  async enableUser(@Args('uuid') uuid: string): Promise<User> {
    return this.userService.enableUser(uuid);
  }

  /**
   * Disables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => User)
  async disableUser(@Args('uuid') uuid: string): Promise<User> {
    return this.userService.disableUser(uuid);
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
    return this.userService.temporarilyDisableUser(tempDisableUserInput);
  }

  @Public()
  @Mutation(() => User)
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Public()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(updateUserInput);
  }

  @Public()
  @Mutation(() => User)
  async remove(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.userService.remove(deleteUserInput);
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
    const myUser = await this.userService.getUser({
      uuid: user.userId,
    } as GetUserArgs);

    if (!myUser) {
      throw new Error(`No user found for ${user.userId}`);
    }

    return myUser;
  }
}
