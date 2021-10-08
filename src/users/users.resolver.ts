import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { User } from "../graphql"
import {GetUserArgs} from "./dto/args/get-user.args";
import {GetUsersArgs} from "./dto/args/get-users.args";
import {DeleteUserInput} from "./dto/input/delete-user.input";

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {name: 'users', nullable: 'items'}) // only items may be null
  getUsers(@Args() getUsersArgs: GetUsersArgs): User[] {
    return this.usersService.getUsers(getUsersArgs);
  }

  @Query(() => User, {name: 'user', nullable: true, })
  getUser(@Args() getUserArgs: GetUserArgs): User {
    return this.usersService.getUser(getUserArgs);
  }

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput);
  }

  @Mutation('removeUser')
  remove(@Args('deleteUserInput') deleteUserInput: DeleteUserInput) {
    return this.usersService.remove(deleteUserInput);
  }
}
