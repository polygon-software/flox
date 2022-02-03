import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import { PubSub } from 'graphql-subscriptions';
import { Public } from '../auth/authentication.decorator';

// Publish/subscribe handler TODO make global and inject/provide, according to https://docs.nestjs.com/graphql/subscriptions
const pubSub = new PubSub();

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
    const newUser = await this.usersService.create(createUserInput);
    // Publish authentication so subscriptions will auto-update
    await pubSub.publish('userAdded', { userAdded: newUser });
    return newUser;
  }

  @Public()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.update(updateUserInput);
  }

  @Public()
  @Mutation(() => User)
  async remove(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return await this.usersService.remove(deleteUserInput);
  }

  @Public()
  @Subscription(() => User)
  userAdded(): AsyncIterator<unknown, any, undefined> {
    return pubSub.asyncIterator('userAdded');
  }
}