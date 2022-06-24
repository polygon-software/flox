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

  /**
   * Creates a User
   * @param {CreateUserInput} createUserInput - contains all user data
   * @returns {Promise<User>} - the newly created user
   */
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  /**
   * Gets a set of users by UUID
   * @param {GetUsersArgs} getUsersArgs - contains UUIDs of users
   * @returns {Promise<User[]>} - the users
   */
  getUsers(getUsersArgs: GetUsersArgs): Promise<User[]> {
    if (getUsersArgs.uuids !== undefined) {
      return this.usersRepository.findByIds(getUsersArgs.uuids);
    } else {
      return this.usersRepository.find();
    }
  }

  /**
   * Gets all users
   * @returns {Promise<User[]>} - the users
   */
  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Gets a user by UUID
   * @param {GetUserArgs} getUserArgs - contains UUID
   * @returns {Promise<User>} - the user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    if (getUserArgs.uuid) {
      return this.usersRepository.findOne(getUserArgs.uuid);
    }

    if (getUserArgs.cognitoUuid) {
      return this.usersRepository.findOne({
        where: {
          cognitoUuid: getUserArgs.cognitoUuid,
        },
      });
    }

    throw new Error(
      'getUser must be called with either uuid or cognitoUuid parameter',
    );
  }

  /**
   * Updates a given user
   * @param {UpdateUserInput} updateUserInput - contains UUID and any new user data
   * @returns {Promise<User>} - the updated user
   */
  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const user = this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  /**
   * Deletes a given user
   * @param {DeleteUserInput} deleteUserInput - contains UUID
   * @returns {Promise<User>} - the deleted user
   */
  async deleteUser(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deletedUser = await this.usersRepository.remove(user);
    deletedUser.uuid = uuid;
    return deletedUser;
  }

  /**
   * Return current user given the Cognito user from the request
   * @param {Record<string, string>} cognitoUser - cognito user from request
   * @returns {Promise<User>} - user
   */
  async getMyUser(cognitoUser: Record<string, string>): Promise<User> {
    const myUser = await this.usersRepository.findOne({
      cognitoUuid: cognitoUser.userId,
    });

    if (!myUser) {
      throw new Error(`No user found for ${cognitoUser.userId}`);
    }
    return myUser;
  }
}
