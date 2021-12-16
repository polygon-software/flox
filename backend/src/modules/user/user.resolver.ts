import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import { Public } from '../../auth/authentication.decorator';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Public()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<User[]> {
    return await this.usersService.getUsers(getUsersArgs);
  }

  @Public()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Public()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return await this.usersService.getUser(getUserArgs);
  }

  @Public()
  @Mutation(() => User)
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Public()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(updateUserInput);
  }

  @Public()
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
    // Get company where user's UUID matches cognitoID
    const myUser = await this.usersService.getUser({
      uuid: user.userId,
    } as GetUserArgs);

    if (!myUser) {
      throw new Error(`No user found for ${user.userId}`);
    }

    return myUser;
  }
}
