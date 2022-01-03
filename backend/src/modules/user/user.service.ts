import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ROLE, USER_STATUS } from '../../ENUM/ENUM';
import {
  disableCognitoAccount,
  enableCognitoAccount,
} from '../../auth/authService';

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

  /**
   * Enables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  async enableUser(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne(uuid);

    // Error checks
    if (!user) {
      throw new Error(`Cannot find user for UUID ${uuid}`);
    }
    if (user.status === USER_STATUS.ACTIVE) {
      throw new Error(`User with UUID ${uuid} is already enabled`);
    }

    const username = user.username;

    // Enable cognito account
    await enableCognitoAccount(username).catch((error: Error) => {
      throw error;
    });

    // Enable on database
    await this.usersRepository.update(uuid, {
      status: USER_STATUS.ACTIVE,
    });
    return this.usersRepository.findOne(uuid);
  }

  /**
   * Disables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @returns {Promise<User>} - the user after editing
   */
  async disableUser(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne(uuid);

    // Error checks
    if (!user) {
      throw new Error(`Cannot find user for UUID ${uuid}`);
    }
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new Error(`User with UUID ${uuid} is not active`);
    }

    const username = user.username;

    // Disable cognito account
    await disableCognitoAccount(username).catch((error: Error) => {
      throw error;
    });

    // Disable on database
    await this.usersRepository.update(uuid, {
      status: USER_STATUS.DISABLED,
    });

    return this.usersRepository.findOne(uuid);
  }

  /**
   * Returns all Players
   * @returns {Promise<User[]>} - all partner users
   */
  getAllPlayers(): Promise<User[]> {
    return this.usersRepository.find({
      role: ROLE.PLAYER,
    });
  }

  /**
   * Returns all Partners
   * @returns {Promise<User[]>} - all partner users
   */
  getAllPartners(): Promise<User[]> {
    return this.usersRepository.find({
      role: ROLE.PARTNER,
    });
  }

  /**
   * Fetches a single user
   * @param {GetUserArgs} getUserArgs - search arguments, containing UUID
   * @returns {Promise<User>} - the user
   */
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
