import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import {GetUserArgs} from "./dto/args/get-user.args";
import {GetUsersArgs} from "./dto/args/get-users.args";
import {DeleteUserInput} from "./dto/input/delete-user.input";
import {Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from "./entities/user.entity";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

  async create(createUserInput: CreateUserInput): Promise<User> {
    return this.usersRepository.create(createUserInput);
  }

  async getUsers(getUsersArgs: GetUsersArgs): Promise<User[]>  {
    return await this.usersRepository.findByIds(getUsersArgs.userIds)
  }

  async getUser(getUserArgs: GetUserArgs): Promise<User> {
    return await this.usersRepository.findOne(getUserArgs.userId)
  }

  async update(updateUserInput: UpdateUserInput): Promise<UpdateResult> {
    return await this.usersRepository.update(updateUserInput.userId, updateUserInput);
  }

  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.userId)
    return await this.usersRepository.remove(user)
  }
}
