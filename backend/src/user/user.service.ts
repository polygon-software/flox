import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.usersRepository.create(createUserInput);
    return await this.usersRepository.save(user);
  }

  async getUsers(getUsersArgs: GetUsersArgs): Promise<User[]> {
    if (getUsersArgs.userIds !== undefined) {
      return await this.usersRepository.findByIds(getUsersArgs.userIds);
    } else {
      return await this.usersRepository.find();
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(getUserArgs: GetUserArgs): Promise<User> {
    return await this.usersRepository.findOne(getUserArgs.userId);
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.userId, user);
    return await this.usersRepository.findOne(updateUserInput.userId);
  }

  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.userId);
    const id = user.id;
    const delUser = await this.usersRepository.remove(user);
    delUser.id = id;
    return delUser;
  }
}
