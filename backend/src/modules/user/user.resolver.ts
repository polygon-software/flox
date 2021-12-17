import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import { AdminOnly, CurrentUser } from '../../auth/authorization.decorator';

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

  @Query(() => User, { name: 'getMyUser' })
  async getMyUser(@CurrentUser() user: Record<string, string>): Promise<User> {
    return this.usersService.getUser({ uuid: user.userId });
  }

  @AdminOnly()
  @Mutation(() => User)
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    // Publish authentication so subscriptions will auto-update
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
}
