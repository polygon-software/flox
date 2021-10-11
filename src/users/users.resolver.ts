import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import {GetUserArgs} from "./dto/args/get-user.args";
import {DeleteUserInput} from "./dto/input/delete-user.input";
import {UpdateResult} from "typeorm";
import {User} from "./entities/user.entity";

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => User, {name: 'user', nullable: true,})
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return await this.usersService.getUser(getUserArgs);
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Mutation('updateUser')
  async update(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UpdateResult> {
    return await this.usersService.update(updateUserInput);
  }

  @Mutation('removeUser')
  async remove(@Args('deleteUserInput') deleteUserInput: DeleteUserInput): Promise<User> {
    return await this.usersService.remove(deleteUserInput);
  }
}
