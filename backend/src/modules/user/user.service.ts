import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ROLE, USER_STATUS } from '../../ENUM/ENUM';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user on the database
   * @param {CreateUserInput} createUserInput - input values
   * @returns {User} - the database user
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserInput,
      role: ROLE.PLAYER,
      status: USER_STATUS.APPLIED, // Default status: applied
    });
    return this.usersRepository.save(user);
  }

  getUsers(getUsersArgs: GetUsersArgs): Promise<User[]> {
    if (getUsersArgs.uuids !== undefined) {
      return this.usersRepository.findByIds(getUsersArgs.uuids);
    } else {
      return this.usersRepository.find();
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  getAllPlayers(): Promise<User[]> {
    return this.usersRepository.find({
      role: ROLE.PLAYER,
    });
  }

  getUser(getUserArgs: GetUserArgs): Promise<User> {
    return this.usersRepository.findOne(getUserArgs.uuid);
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deleted_user = await this.usersRepository.remove(user);
    deleted_user.uuid = uuid;
    return deleted_user;
  }
}
