import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Create User
   * @param {CreateUserInput} createUserInput - user input
   * @returns {Promise<User>} - new user
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  /**
   * Get Users
   * @param {GetUsersArgs} getUsersArgs - get Users args
   * @returns {Promise<User[]>} - array of users
   */
  getUsers(getUsersArgs: GetUsersArgs): Promise<User[]> {
    if (getUsersArgs.uuids !== undefined) {
      return this.usersRepository.findByIds(getUsersArgs.uuids);
    } else {
      return this.usersRepository.find();
    }
  }

  /**
   * Get all Users
   * @returns {Promise<User[]>} - array of all users
   */
  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Get User
   * @param {GetUserArgs} getUserArgs - get User args
   * @returns {Promise<User>} - user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    this.logger.warn(`Requested user with ID: ${getUserArgs.uuid}`);
    return this.usersRepository.findOne(getUserArgs.uuid);
  }

  /**
   * Update a User
   * @param {UpdateUserInput} updateUserInput - fields to update
   * @returns {Promise<User>} - user
   */
  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const user = this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  /**
   * Deletes User
   * @param {DeleteUserInput} deleteUserInput - user to delete
   * @returns {Promise<User>} - user
   */
  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deletedUser = await this.usersRepository.softRemove(user);
    deletedUser.uuid = uuid;
    return deletedUser;
  }
}
