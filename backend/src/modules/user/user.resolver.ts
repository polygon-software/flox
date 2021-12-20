import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { Public } from '../../auth/authentication.decorator';

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
}
