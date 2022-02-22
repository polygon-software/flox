import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ROLE } from '../../ENUM/ENUM';
import { RegisterUserInput } from './dto/input/register-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Register a new user. Returns null if user email is not in DB.
   * @param {RegisterUserInput} registerUserInput - input values
   * @returns {User} - the database user
   */
  async register(registerUserInput: RegisterUserInput): Promise<User> {
    const update = this.usersRepository.create(registerUserInput);
    const user = await this.usersRepository.findOne({
      where: { email: update.email },
    });
    if (user) {
      await this.usersRepository.update(user.uuid, update);
      return this.usersRepository.findOne(user.uuid);
    }
    return null;
  }

  /**
   * Check if user email is in DB.
   * @param {string} email - user email.
   * @returns {boolean} - if the email is in the DB.
   */
  async getUserAllowed(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    return !!user;
  }

  /**
   * Creates a new user on the database
   * @param {CreateUserInput} createUserInput - input values
   * @returns {User} - the database user
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserInput,
      role: ROLE.USER,
    });
    return this.usersRepository.save(user);
  }

  /**
   * Returns all Players
   * @returns {Promise<User[]>} - all partner users
   */
  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: ROLE.USER },
    });
  }

  /**
   * Fetches a single user
   * @param {string} cognitoUuid - cognito UUID of the requester
   * @returns {Promise<User>} - the user
   */
  myUser(cognitoUuid: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { cognitoUuid: cognitoUuid },
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
    const user = this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deletedUser = await this.usersRepository.remove(user);
    deletedUser.uuid = uuid;
    return deletedUser;
  }
}
